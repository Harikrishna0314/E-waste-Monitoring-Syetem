"""
AI Service for YOLO-based E-Waste Detection
"""
import cv2
import numpy as np
from ultralytics import YOLO
import time
from PIL import Image
import io
import requests
from datetime import datetime

class EWasteDetectionService:
    """Service for detecting e-waste items using YOLOv11"""
    
    # E-waste item classes
    EWASTE_CLASSES = {
        0: 'laptop',
        1: 'mobile',
        2: 'battery',
        3: 'keyboard',
        4: 'mouse',
        5: 'monitor',
        6: 'cpu',
        7: 'printer',
        8: 'cable',
        9: 'router'
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
    
    def __init__(self, model_path='yolov11n.pt'):
        """Initialize the YOLO model"""
        try:
            self.model = YOLO(model_path)
            self.model_version = 'yolov11n'
        except Exception as e:
            print(f"Error loading model: {e}")
            self.model = None
    
    def detect_from_file(self, image_path):
        """Detect e-waste items from an image file"""
        if not self.model:
            return {'error': 'Model not loaded'}
        
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
    
    def detect_from_url(self, image_url):
        """Detect e-waste items from an image URL"""
        if not self.model:
            return {'error': 'Model not loaded'}
        
        try:
            start_time = time.time()
            
            # Download image
            response = requests.get(image_url, timeout=10)
            image_array = np.frombuffer(response.content, np.uint8)
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
    
    def detect_from_bytes(self, image_bytes):
        """Detect e-waste items from image bytes"""
        if not self.model:
            return {'error': 'Model not loaded'}
        
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
                class_name = self.EWASTE_CLASSES.get(class_id, 'unknown')
                
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
