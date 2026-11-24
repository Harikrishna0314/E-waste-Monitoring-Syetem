"""
Flask Application - E-Waste Monitoring System
"""
from flask import Flask, request, jsonify
from flask_cors import CORS
from config import config
from models import db, User, AIPrediction, EnvironmentalAnalytics
from ai_service import ai_service
from datetime import datetime
import os
import uuid
from werkzeug.utils import secure_filename

def create_app(config_name='development'):
    """Create and configure Flask application"""
    app = Flask(__name__)
    
    # Load configuration
    app.config.from_object(config[config_name])
    
    # Initialize extensions
    db.init_app(app)
    CORS(app, origins=app.config['CORS_ORIGINS'])
    
    # Create upload folder
    os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)
    
    with app.app_context():
        db.create_all()
    
    # ==================== PUBLIC APP ROUTES ====================

    def get_guest_user():
        """Return a stable system user for anonymous AI prediction records."""
        guest = User.query.filter_by(email='guest@ewaste.local').first()
        if guest:
            return guest
        guest = User(
            email='guest@ewaste.local',
            password_hash='authentication-disabled',
            full_name='Anonymous Visitor',
            role='guest',
            is_active=True
        )
        db.session.add(guest)
        db.session.commit()
        return guest

    # ==================== AI PREDICTION ROUTES ====================
    
    @app.route('/api/ai/predict', methods=['POST'])
    def predict():
        """Predict e-waste items from image"""
        try:
            if 'file' not in request.files:
                return jsonify({'error': 'No file provided'}), 400
            
            file = request.files['file']
            
            if file.filename == '':
                return jsonify({'error': 'No file selected'}), 400
            
            # Save file temporarily
            safe_name = secure_filename(file.filename)
            if not safe_name or not file.mimetype or not file.mimetype.startswith('image/'):
                return jsonify({'error': 'Please upload a valid image file'}), 400
            temp_path = os.path.join(app.config['UPLOAD_FOLDER'], f'{uuid.uuid4().hex}_{safe_name}')
            file.save(temp_path)
            
            # Run detection
            result = ai_service.detect_from_file(temp_path)
            
            if 'error' in result:
                return jsonify(result), 400
            
            # Store prediction in database
            guest_user = get_guest_user()
            prediction = AIPrediction(
                user_id=guest_user.id,
                image_url=temp_path,
                detected_objects=result.get('detected_objects'),
                bounding_boxes=result.get('bounding_boxes'),
                confidence_scores=result.get('confidence_scores'),
                estimated_weights=result.get('estimated_weights'),
                estimated_values=result.get('estimated_values'),
                hazard_levels=result.get('hazard_levels'),
                recommendations=result.get('recommendations'),
                model_version=result.get('model_version'),
                accuracy=result.get('accuracy'),
                processing_time=result.get('processing_time')
            )
            
            db.session.add(prediction)
            db.session.commit()
            
            return jsonify({
                'prediction_id': prediction.id,
                'detected_objects': result.get('detected_objects'),
                'bounding_boxes': result.get('bounding_boxes'),
                'confidence_scores': result.get('confidence_scores'),
                'estimated_weights': result.get('estimated_weights'),
                'estimated_values': result.get('estimated_values'),
                'hazard_levels': result.get('hazard_levels'),
                'recommendations': result.get('recommendations'),
                'total_items': result.get('total_items'),
                'total_weight': result.get('total_weight'),
                'total_value': result.get('total_value'),
                'accuracy': result.get('accuracy'),
                'processing_time': result.get('processing_time')
            }), 200
        
        except Exception as e:
            return jsonify({'error': str(e)}), 500
    
    # ==================== ENVIRONMENTAL ANALYTICS ROUTES ====================
    
    @app.route('/api/analytics/environmental', methods=['GET'])
    def get_environmental_analytics():
        """Get environmental analytics"""
        try:
            analytics = EnvironmentalAnalytics.query.order_by(EnvironmentalAnalytics.date.desc()).limit(30).all()
            
            return jsonify({
                'analytics': [{
                    'date': a.date.isoformat(),
                    'co2_saved': a.co2_saved,
                    'energy_saved': a.energy_saved,
                    'water_saved': a.water_saved,
                    'trees_saved': a.trees_saved,
                    'plastic_recovered': a.plastic_recovered,
                    'copper_recovered': a.copper_recovered,
                    'aluminium_recovered': a.aluminium_recovered,
                    'environmental_score': a.environmental_score,
                    'total_items_recycled': a.total_items_recycled
                } for a in analytics]
            }), 200
        
        except Exception as e:
            return jsonify({'error': str(e)}), 500
    
    # ==================== HEALTH CHECK ====================
    
    @app.route('/api/health', methods=['GET'])
    def health_check():
        """Health check endpoint"""
        return jsonify({'status': 'healthy'}), 200
    
    @app.errorhandler(404)
    def not_found(error):
        return jsonify({'error': 'Endpoint not found'}), 404
    
    @app.errorhandler(500)
    def internal_error(error):
        db.session.rollback()
        return jsonify({'error': 'Internal server error'}), 500
    
    return app

if __name__ == '__main__':
    app = create_app()
    app.run(debug=True, host='0.0.0.0', port=5000)
