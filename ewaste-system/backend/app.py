"""
Flask Application - E-Waste Monitoring System
"""
from flask import Flask, request, jsonify
from flask_cors import CORS
from config import config
from models import db, User, CollectionCenter, EWasteItem, PickupRequest, AIPrediction, Notification, EnvironmentalAnalytics
from auth import hash_password, verify_password, generate_token, token_required, admin_required, developer_required
from ai_service import ai_service
from datetime import datetime
import os

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
    
    # ==================== AUTH ROUTES ====================
    
    @app.route('/api/auth/register', methods=['POST'])
    def register():
        """Register a new user"""
        try:
            data = request.get_json()
            
            if not data or not all(k in data for k in ['email', 'password', 'full_name', 'role']):
                return jsonify({'error': 'Missing required fields'}), 400
            
            if User.query.filter_by(email=data['email']).first():
                return jsonify({'error': 'Email already exists'}), 400
            
            user = User(
                email=data['email'],
                password_hash=hash_password(data['password']),
                full_name=data['full_name'],
                role=data.get('role', 'user'),
                phone=data.get('phone'),
                address=data.get('address'),
                city=data.get('city'),
                state=data.get('state'),
                postal_code=data.get('postal_code'),
                country=data.get('country')
            )
            
            db.session.add(user)
            db.session.commit()
            
            token = generate_token(user.id, user.role)
            
            return jsonify({
                'message': 'User registered successfully',
                'user': user.to_dict(),
                'token': token
            }), 201
        
        except Exception as e:
            db.session.rollback()
            return jsonify({'error': str(e)}), 500
    
    @app.route('/api/auth/login', methods=['POST'])
    def login():
        """Login user"""
        try:
            data = request.get_json()
            
            if not data or not all(k in data for k in ['email', 'password']):
                return jsonify({'error': 'Missing email or password'}), 400
            
            user = User.query.filter_by(email=data['email']).first()
            
            if not user or not verify_password(data['password'], user.password_hash):
                return jsonify({'error': 'Invalid email or password'}), 401
            
            if not user.is_active:
                return jsonify({'error': 'User account is inactive'}), 403
            
            token = generate_token(user.id, user.role)
            
            return jsonify({
                'message': 'Login successful',
                'user': user.to_dict(),
                'token': token
            }), 200
        
        except Exception as e:
            return jsonify({'error': str(e)}), 500
    
    @app.route('/api/auth/me', methods=['GET'])
    @token_required
    def get_current_user():
        """Get current user info"""
        try:
            user = User.query.get(request.user_id)
            if not user:
                return jsonify({'error': 'User not found'}), 404
            
            return jsonify(user.to_dict()), 200
        
        except Exception as e:
            return jsonify({'error': str(e)}), 500
    
    # ==================== ADMIN ROUTES ====================
    
    @app.route('/api/admin/dashboard', methods=['GET'])
    @token_required
    @admin_required
    def admin_dashboard():
        """Get admin dashboard data"""
        try:
            total_users = User.query.count()
            total_centers = CollectionCenter.query.count()
            pending_requests = PickupRequest.query.filter_by(status='pending').count()
            completed_requests = PickupRequest.query.filter_by(status='completed').count()
            
            return jsonify({
                'total_users': total_users,
                'total_centers': total_centers,
                'pending_requests': pending_requests,
                'completed_requests': completed_requests
            }), 200
        
        except Exception as e:
            return jsonify({'error': str(e)}), 500
    
    @app.route('/api/admin/users', methods=['GET'])
    @token_required
    @admin_required
    def get_users():
        """Get all users"""
        try:
            page = request.args.get('page', 1, type=int)
            per_page = request.args.get('per_page', 10, type=int)
            
            users = User.query.paginate(page=page, per_page=per_page)
            
            return jsonify({
                'users': [u.to_dict() for u in users.items],
                'total': users.total,
                'pages': users.pages,
                'current_page': page
            }), 200
        
        except Exception as e:
            return jsonify({'error': str(e)}), 500
    
    @app.route('/api/admin/collection-centers', methods=['GET'])
    @token_required
    @admin_required
    def get_collection_centers():
        """Get all collection centers"""
        try:
            centers = CollectionCenter.query.all()
            
            return jsonify({
                'centers': [{
                    'id': c.id,
                    'center_name': c.center_name,
                    'latitude': c.latitude,
                    'longitude': c.longitude,
                    'capacity': c.capacity,
                    'current_inventory': c.current_inventory,
                    'is_active': c.is_active
                } for c in centers]
            }), 200
        
        except Exception as e:
            return jsonify({'error': str(e)}), 500
    
    # ==================== AI PREDICTION ROUTES ====================
    
    @app.route('/api/ai/predict', methods=['POST'])
    @token_required
    def predict():
        """Predict e-waste items from image"""
        try:
            if 'file' not in request.files:
                return jsonify({'error': 'No file provided'}), 400
            
            file = request.files['file']
            
            if file.filename == '':
                return jsonify({'error': 'No file selected'}), 400
            
            # Save file temporarily
            temp_path = os.path.join(app.config['UPLOAD_FOLDER'], file.filename)
            file.save(temp_path)
            
            # Run detection
            result = ai_service.detect_from_file(temp_path)
            
            if 'error' in result:
                return jsonify(result), 400
            
            # Store prediction in database
            prediction = AIPrediction(
                user_id=request.user_id,
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
    
    # ==================== PICKUP REQUEST ROUTES ====================
    
    @app.route('/api/pickups', methods=['POST'])
    @token_required
    def create_pickup_request():
        """Create a new pickup request"""
        try:
            data = request.get_json()
            
            if not data or 'ewaste_item_id' not in data:
                return jsonify({'error': 'Missing required fields'}), 400
            
            pickup = PickupRequest(
                user_id=request.user_id,
                ewaste_item_id=data['ewaste_item_id'],
                pickup_date=data.get('pickup_date'),
                pickup_time=data.get('pickup_time'),
                notes=data.get('notes')
            )
            
            db.session.add(pickup)
            db.session.commit()
            
            return jsonify({
                'message': 'Pickup request created',
                'pickup_id': pickup.id
            }), 201
        
        except Exception as e:
            db.session.rollback()
            return jsonify({'error': str(e)}), 500
    
    @app.route('/api/pickups/<int:pickup_id>', methods=['GET'])
    @token_required
    def get_pickup_request(pickup_id):
        """Get pickup request details"""
        try:
            pickup = PickupRequest.query.get(pickup_id)
            
            if not pickup:
                return jsonify({'error': 'Pickup request not found'}), 404
            
            return jsonify({
                'id': pickup.id,
                'status': pickup.status,
                'pickup_date': pickup.pickup_date.isoformat() if pickup.pickup_date else None,
                'pickup_time': str(pickup.pickup_time) if pickup.pickup_time else None,
                'notes': pickup.notes
            }), 200
        
        except Exception as e:
            return jsonify({'error': str(e)}), 500
    
    # ==================== ENVIRONMENTAL ANALYTICS ROUTES ====================
    
    @app.route('/api/analytics/environmental', methods=['GET'])
    @token_required
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
