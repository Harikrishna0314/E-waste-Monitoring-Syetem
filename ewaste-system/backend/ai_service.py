"""
AI Service for YOLO-based E-Waste Detection
"""
import cv2
import numpy as np
import time
from PIL import Image
import io
import os
from pathlib import Path

class EWasteDetectionService:
    """Service for detecting e-waste items using YOLOv11"""
    
    # Accept only class names from a model trained for e-waste. Never infer
    # e-waste labels from numeric IDs in a generic COCO model.
    LABEL_ALIASES = {
        'laptop': 'laptop', 'notebook': 'laptop',
        'mobile': 'mobile', 'mobile phone': 'mobile', 'cell phone': 'mobile', 'smartphone': 'mobile', 'phone': 'mobile',
        'battery': 'battery', 'keyboard': 'keyboard', 'mouse': 'mouse',
        'monitor': 'monitor', 'screen': 'monitor', 'display': 'monitor', 'tv': 'monitor',
        'cpu': 'cpu', 'desktop': 'cpu', 'computer': 'cpu', 'computer tower': 'cpu',
        'printer': 'printer', 'cable': 'cable', 'wire': 'cable',
        'router': 'router'
    }
    
    # Hazard levels for different items
    HAZARD_LEVELS = {
        'laptop': 'high',
        'mobile': 'medium',
        'battery': 'high',
        'keyboard': 'low',
        'mouse': 'low',
        'monitor': 'high',
        'cpu': 'high',
        'printer': 'medium',
        'cable': 'low',
        'router': 'medium'
    }
    
    # Estimated weights (in kg)
    ESTIMATED_WEIGHTS = {
        'laptop': 2.0,
        'mobile': 0.2,
        'battery': 0.5,
        'keyboard': 0.5,
        'mouse': 0.1,
        'monitor': 5.0,
        'cpu': 3.0,
        'printer': 8.0,
        'cable': 0.2,
        'router': 0.5
    }
    
    # Estimated recycling value (in USD)
    ESTIMATED_VALUES = {
        'laptop': 50,
        'mobile': 30,
        'battery': 10,
        'keyboard': 5,
        'mouse': 3,
        'monitor': 20,
        'cpu': 40,
        'printer': 15,
        'cable': 2,
        'router': 10
    }
    
    def __init__(self, model_path=None):
        """Defer loading large AI weights until a prediction is requested."""
        self.model_path = model_path or os.getenv('YOLO_MODEL_PATH', os.path.join(os.path.dirname(__file__), '..', 'ai', 'models', 'yolov11n.pt'))
        self.model = None
        self.model_version = 'unavailable'
        self.model_load_attempted = False

    def _ensure_model(self):
        """Load YOLO on demand so auth and dashboard APIs can start quickly."""
        if self.model_load_attempted:
            return self.model is not None
        if not os.path.isfile(self.model_path):
            print(f"E-waste model weights not found: {self.model_path}")
            return False
        self.model_load_attempted = True
        try:
            from ultralytics import YOLO
            self.model = YOLO(self.model_path)
            self.model_version = Path(self.model_path).stem
            names = self.model.names
            labels = names.values() if isinstance(names, dict) else names
            normalized = {self._normalize_label(label) for label in labels}
            if not normalized.intersection(set(self.LABEL_ALIASES.values())):
                print('Configured weights do not contain supported e-waste classes; detection disabled.')
                self.model = None
            return self.model is not None
        except Exception as e:
            print(f"Error loading e-waste model: {e}")
            self.model = None
            return False

    @staticmethod
    def _normalize_label(label):
        return ' '.join(str(label).strip().lower().replace('_', ' ').replace('-', ' ').split())

    def _e_waste_label(self, class_id):
        names = self.model.names
        raw_label = names.get(class_id, 'unknown') if isinstance(names, dict) else (
            names[class_id] if class_id < len(names) else 'unknown'
        )
        return self.LABEL_ALIASES.get(self._normalize_label(raw_label))
    
    def detect_from_file(self, image_path):
        """Detect e-waste items from an image file"""
        if not self._ensure_model():
            return {'error': 'The e-waste detection model is not installed or configured. Set YOLO_MODEL_PATH to your trained .pt weights.'}
        
        try:
            start_time = time.time()
            
            # Read image
            image = cv2.imread(image_path)
            if image is None:
                return {'error': 'Failed to read image'}
            
            # Run inference
            results = self.model(image)
            processing_time = time.time() - start_time
            
            # Process results
            detection_data = self._process_results(results, image)
            detection_data['processing_time'] = processing_time
            detection_data['model_version'] = self.model_version
            
            return detection_data
        
        except Exception as e:
            return {'error': str(e)}
    
    def detect_from_bytes(self, image_bytes):
        """Detect e-waste items from image bytes"""
        if not self._ensure_model():
            return {'error': 'The e-waste detection model is not installed or configured. Set YOLO_MODEL_PATH to your trained .pt weights.'}
        
        try:
            start_time = time.time()
            
            # Decode image
            image_array = np.frombuffer(image_bytes, np.uint8)
            image = cv2.imdecode(image_array, cv2.IMREAD_COLOR)
            
            if image is None:
                return {'error': 'Failed to decode image'}
            
            # Run inference
            results = self.model(image)
            processing_time = time.time() - start_time
            
            # Process results
            detection_data = self._process_results(results, image)
            detection_data['processing_time'] = processing_time
            detection_data['model_version'] = self.model_version
            
            return detection_data
        
        except Exception as e:
            return {'error': str(e)}
    
    def _process_results(self, results, image):
        """Process YOLO results"""
        detected_objects = []
        bounding_boxes = []
        confidence_scores = []
        estimated_weights = []
        estimated_values = []
        hazard_levels = []
        recommendations = []
        
        for result in results:
            boxes = result.boxes
            
            for box in boxes:
                # Get class
                class_id = int(box.cls[0])
                class_name = self._e_waste_label(class_id)
                if not class_name:
                    continue
                
                # Get confidence
                confidence = float(box.conf[0])
                
                # Get bounding box coordinates
                x1, y1, x2, y2 = box.xyxy[0]
                bbox = {
                    'x1': float(x1),
                    'y1': float(y1),
                    'x2': float(x2),
                    'y2': float(y2),
                    'width': float(x2 - x1),
                    'height': float(y2 - y1)
                }
                
                # Get metadata
                weight = self.ESTIMATED_WEIGHTS.get(class_name, 1.0)
                value = self.ESTIMATED_VALUES.get(class_name, 10)
                hazard = self.HAZARD_LEVELS.get(class_name, 'medium')
                
                # Generate recommendation
                recommendation = self._get_recommendation(class_name, hazard)
                
                detected_objects.append(class_name)
                bounding_boxes.append(bbox)
                confidence_scores.append(confidence)
                estimated_weights.append(weight)
                estimated_values.append(value)
                hazard_levels.append(hazard)
                recommendations.append(recommendation)
        
        # Calculate accuracy (average confidence)
        accuracy = np.mean(confidence_scores) if confidence_scores else 0
        
        return {
            'detected_objects': detected_objects,
            'bounding_boxes': bounding_boxes,
            'confidence_scores': confidence_scores,
            'estimated_weights': estimated_weights,
            'estimated_values': estimated_values,
            'hazard_levels': hazard_levels,
            'recommendations': recommendations,
            'total_items': len(detected_objects),
            'total_weight': sum(estimated_weights),
            'total_value': sum(estimated_values),
            'accuracy': float(accuracy)
        }
    
    def _get_recommendation(self, item_type, hazard_level):
        """Get recycling recommendation based on item type and hazard level"""
        recommendations = {
            'laptop': 'Laptop contains valuable metals and hazardous materials. Send to certified e-waste recycler.',
            'mobile': 'Mobile phone contains rare earth elements. Recycle through authorized mobile recycler.',
            'battery': 'Battery is hazardous. Must be recycled separately at designated battery recycling center.',
            'keyboard': 'Keyboard can be refurbished or recycled. Check for reuse potential first.',
            'mouse': 'Mouse can be refurbished or recycled. Check for reuse potential first.',
            'monitor': 'Monitor contains mercury and lead. Send to certified e-waste recycler.',
            'cpu': 'CPU contains valuable metals. Send to certified e-waste recycler.',
            'printer': 'Printer contains hazardous toner. Send to certified e-waste recycler.',
            'cable': 'Cable can be recycled for copper recovery.',
            'router': 'Router contains circuit boards. Send to certified e-waste recycler.'
        }
        return recommendations.get(item_type, 'Send to certified e-waste recycler.')

# Initialize the service
ai_service = EWasteDetectionService()
