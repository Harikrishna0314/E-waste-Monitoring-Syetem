"""Database-free Flask API for the public CirculAI E-Waste Monitoring demo."""
from flask import Flask, request, jsonify
from flask_cors import CORS
from ai_service import ai_service
from werkzeug.utils import secure_filename
import os
import uuid

SUPPORTED_CLASSES = [
    'laptop', 'mobile', 'battery', 'keyboard', 'mouse',
    'monitor', 'cpu', 'printer', 'cable', 'router'
]
ALLOWED_MIME_TYPES = {'image/jpeg', 'image/png', 'image/webp'}
MAX_IMAGE_BYTES = 10 * 1024 * 1024


def create_app(config_name='development'):
    app = Flask(__name__)
    app.config['MAX_CONTENT_LENGTH'] = MAX_IMAGE_BYTES + (1024 * 1024)
    app.config['UPLOAD_FOLDER'] = os.path.join(os.path.dirname(__file__), '..', 'uploads')
    origins = os.getenv('CORS_ORIGINS', '*')
    CORS(app, origins='*' if origins == '*' else [x.strip() for x in origins.split(',') if x.strip()])

    @app.route('/api/ai/predict', methods=['POST'])
    def predict():
        if 'file' not in request.files:
            return jsonify({'error': 'No image file was provided. Use multipart field name "file".'}), 400
        uploaded = request.files['file']
        if not uploaded.filename:
            return jsonify({'error': 'No file was selected.'}), 400
        filename = secure_filename(uploaded.filename)
        if not filename or uploaded.mimetype not in ALLOWED_MIME_TYPES:
            return jsonify({'error': 'Unsupported image format. Upload a JPG, PNG, or WEBP image.'}), 415

        uploaded.stream.seek(0, os.SEEK_END)
        size = uploaded.stream.tell()
        uploaded.stream.seek(0)
        if size <= 0:
            return jsonify({'error': 'The uploaded image is empty.'}), 400
        if size > MAX_IMAGE_BYTES:
            return jsonify({'error': 'Image must be 10 MB or smaller.'}), 413

        temp_path = None
        try:
            os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)
            temp_path = os.path.join(app.config['UPLOAD_FOLDER'], f'{uuid.uuid4().hex}_{filename}')
            uploaded.save(temp_path)
            result = ai_service.detect_from_file(temp_path)
            if 'error' in result:
                return jsonify(result), 503 if 'model' in result['error'].lower() else 400
            return jsonify({
                'detected_objects': result.get('detected_objects', []),
                'bounding_boxes': result.get('bounding_boxes', []),
                'confidence_scores': result.get('confidence_scores', []),
                'estimated_weights': result.get('estimated_weights', []),
                'estimated_values': result.get('estimated_values', []),
                'hazard_levels': result.get('hazard_levels', []),
                'recommendations': result.get('recommendations', []),
                'total_items': result.get('total_items', 0),
                'total_weight': result.get('total_weight', 0),
                'total_value': result.get('total_value', 0),
                'accuracy': result.get('accuracy', 0),
                'processing_time': result.get('processing_time', 0),
                'model_version': result.get('model_version')
            }), 200
        except Exception:
            app.logger.exception('AI prediction failed')
            return jsonify({'error': 'AI prediction failed. Check the backend model configuration and try again.'}), 500
        finally:
            if temp_path and os.path.exists(temp_path):
                try:
                    os.remove(temp_path)
                except OSError:
                    app.logger.warning('Could not remove temporary uploaded image: %s', temp_path)

    @app.route('/api/ai/model-info', methods=['GET'])
    def model_info():
        model_path = ai_service.model_path
        weights_available = os.path.isfile(model_path)
        return jsonify({
            'configured': weights_available,
            'model_name': os.path.basename(model_path),
            'weights_available': weights_available,
            'supported_classes': SUPPORTED_CLASSES,
            'max_image_size_mb': 10,
            'inference_endpoint': '/api/ai/predict'
        }), 200

    @app.route('/api/analytics/environmental', methods=['GET'])
    def get_environmental_analytics():
        return jsonify({
            'analytics': [],
            'mode': 'database-free',
            'message': 'No live analytics are collected in this public demo.'
        }), 200

    @app.route('/api/health', methods=['GET'])
    def health_check():
        weights_available = os.path.isfile(ai_service.model_path)
        return jsonify({
            'status': 'healthy',
            'database': 'disabled',
            'ai_model_configured': weights_available
        }), 200

    @app.errorhandler(404)
    def not_found(error):
        return jsonify({'error': 'Endpoint not found'}), 404

    @app.errorhandler(413)
    def file_too_large(error):
        return jsonify({'error': 'Image must be 10 MB or smaller.'}), 413

    return app


app = create_app()

if __name__ == '__main__':
    app.run(debug=os.getenv('FLASK_ENV') != 'production', host='0.0.0.0', port=int(os.getenv('PORT', 5000)))
