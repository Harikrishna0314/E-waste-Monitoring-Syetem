"""Database-free Flask API for the public E-Waste Monitoring demo."""
from flask import Flask, request, jsonify
from flask_cors import CORS
from ai_service import ai_service
from werkzeug.utils import secure_filename
import os
import uuid


def create_app(config_name='development'):
    app = Flask(__name__)
    app.config['MAX_CONTENT_LENGTH'] = 50 * 1024 * 1024
    app.config['UPLOAD_FOLDER'] = os.path.join(os.path.dirname(__file__), '..', 'uploads')
    origins = os.getenv('CORS_ORIGINS', '*')
    CORS(app, origins='*' if origins == '*' else [x.strip() for x in origins.split(',') if x.strip()])

    @app.route('/api/ai/predict', methods=['POST'])
    def predict():
        if 'file' not in request.files:
            return jsonify({'error': 'No file provided'}), 400
        file = request.files['file']
        if not file.filename:
            return jsonify({'error': 'No file selected'}), 400
        safe_name = secure_filename(file.filename)
        if not safe_name or not file.mimetype or not file.mimetype.startswith('image/'):
            return jsonify({'error': 'Please upload a valid image file'}), 400

        temp_path = None
        try:
            os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)
            temp_path = os.path.join(app.config['UPLOAD_FOLDER'], f'{uuid.uuid4().hex}_{safe_name}')
            file.save(temp_path)
            result = ai_service.detect_from_file(temp_path)
            if 'error' in result:
                return jsonify(result), 400
            # Return inference results directly; no account or database is required.
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
            return jsonify({'error': 'AI prediction failed. Check the backend model and try again.'}), 500
        finally:
            if temp_path and os.path.exists(temp_path):
                try:
                    os.remove(temp_path)
                except OSError:
                    app.logger.warning('Could not remove temporary uploaded image: %s', temp_path)

    @app.route('/api/analytics/environmental', methods=['GET'])
    def get_environmental_analytics():
        return jsonify({'analytics': []}), 200

    @app.route('/api/health', methods=['GET'])
    def health_check():
        return jsonify({'status': 'healthy', 'database': 'disabled'}), 200

    @app.errorhandler(404)
    def not_found(error):
        return jsonify({'error': 'Endpoint not found'}), 404

    @app.errorhandler(413)
    def file_too_large(error):
        return jsonify({'error': 'Uploaded file is too large'}), 413

    return app


app = create_app()

if __name__ == '__main__':
    app.run(debug=os.getenv('FLASK_ENV') != 'production', host='0.0.0.0', port=int(os.getenv('PORT', 5000)))
