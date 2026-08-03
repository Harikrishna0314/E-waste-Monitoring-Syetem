"""
SQLAlchemy Database Models
"""
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
import json

db = SQLAlchemy()

class User(db.Model):
    """User model"""
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(255), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    full_name = db.Column(db.String(255), nullable=False)
    role = db.Column(db.String(50), nullable=False, default='user')
    phone = db.Column(db.String(20))
    address = db.Column(db.Text)
    city = db.Column(db.String(100))
    state = db.Column(db.String(100))
    postal_code = db.Column(db.String(20))
    country = db.Column(db.String(100))
    profile_image_url = db.Column(db.String(500))
    is_active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'email': self.email,
            'full_name': self.full_name,
            'role': self.role,
            'phone': self.phone,
            'address': self.address,
            'city': self.city,
            'state': self.state,
            'postal_code': self.postal_code,
            'country': self.country,
            'profile_image_url': self.profile_image_url,
            'is_active': self.is_active,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat()
        }

class CollectionCenter(db.Model):
    """Collection Center model"""
    __tablename__ = 'collection_centers'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    center_name = db.Column(db.String(255), nullable=False)
    latitude = db.Column(db.Float)
    longitude = db.Column(db.Float)
    capacity = db.Column(db.Integer)
    current_inventory = db.Column(db.Integer, default=0)
    phone = db.Column(db.String(20))
    email = db.Column(db.String(255))
    operating_hours = db.Column(db.String(255))
    is_active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    user = db.relationship('User', backref='collection_centers')

class EWasteItem(db.Model):
    """E-Waste Item model"""
    __tablename__ = 'ewaste_items'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    item_type = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text)
    condition = db.Column(db.String(50))
    estimated_weight = db.Column(db.Float)
    estimated_value = db.Column(db.Float)
    hazard_level = db.Column(db.String(20), default='low')
    image_url = db.Column(db.String(500))
    status = db.Column(db.String(50), default='pending')
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    user = db.relationship('User', backref='ewaste_items')

class PickupRequest(db.Model):
    """Pickup Request model"""
    __tablename__ = 'pickup_requests'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    collection_center_id = db.Column(db.Integer, db.ForeignKey('collection_centers.id'))
    collector_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    ewaste_item_id = db.Column(db.Integer, db.ForeignKey('ewaste_items.id'), nullable=False)
    pickup_date = db.Column(db.Date)
    pickup_time = db.Column(db.Time)
    status = db.Column(db.String(50), default='pending')
    notes = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    user = db.relationship('User', foreign_keys=[user_id], backref='pickup_requests')
    collector = db.relationship('User', foreign_keys=[collector_id])
    collection_center = db.relationship('CollectionCenter', backref='pickup_requests')
    ewaste_item = db.relationship('EWasteItem', backref='pickup_requests')

class AIPrediction(db.Model):
    """AI Prediction model"""
    __tablename__ = 'ai_predictions'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    image_url = db.Column(db.String(500), nullable=False)
    detected_objects = db.Column(db.JSON)
    bounding_boxes = db.Column(db.JSON)
    confidence_scores = db.Column(db.JSON)
    estimated_weights = db.Column(db.JSON)
    estimated_values = db.Column(db.JSON)
    hazard_levels = db.Column(db.JSON)
    recommendations = db.Column(db.JSON)
    model_version = db.Column(db.String(50))
    accuracy = db.Column(db.Float)
    processing_time = db.Column(db.Float)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    user = db.relationship('User', backref='ai_predictions')

class DatasetImage(db.Model):
    """Dataset Image model"""
    __tablename__ = 'dataset_images'
    
    id = db.Column(db.Integer, primary_key=True)
    image_url = db.Column(db.String(500), nullable=False)
    class_label = db.Column(db.String(100), nullable=False)
    image_size = db.Column(db.Integer)
    uploaded_by = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    dataset_split = db.Column(db.String(20), default='train')
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    user = db.relationship('User', backref='dataset_images')

class ModelTraining(db.Model):
    """Model Training model"""
    __tablename__ = 'model_training'
    
    id = db.Column(db.Integer, primary_key=True)
    model_name = db.Column(db.String(255), nullable=False)
    model_version = db.Column(db.String(50))
    epochs = db.Column(db.Integer)
    batch_size = db.Column(db.Integer)
    learning_rate = db.Column(db.Float)
    image_size = db.Column(db.Integer)
    gpu_used = db.Column(db.String(100))
    status = db.Column(db.String(50), default='pending')
    loss = db.Column(db.Float)
    precision = db.Column(db.Float)
    recall = db.Column(db.Float)
    f1_score = db.Column(db.Float)
    mAP = db.Column(db.Float)
    training_logs = db.Column(db.Text)
    started_at = db.Column(db.DateTime)
    completed_at = db.Column(db.DateTime)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class EnvironmentalAnalytics(db.Model):
    """Environmental Analytics model"""
    __tablename__ = 'environmental_analytics'
    
    id = db.Column(db.Integer, primary_key=True)
    date = db.Column(db.Date, nullable=False)
    co2_saved = db.Column(db.Float, default=0)
    energy_saved = db.Column(db.Float, default=0)
    water_saved = db.Column(db.Float, default=0)
    trees_saved = db.Column(db.Integer, default=0)
    plastic_recovered = db.Column(db.Float, default=0)
    copper_recovered = db.Column(db.Float, default=0)
    aluminium_recovered = db.Column(db.Float, default=0)
    environmental_score = db.Column(db.Float, default=0)
    total_items_recycled = db.Column(db.Integer, default=0)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class Report(db.Model):
    """Report model"""
    __tablename__ = 'reports'
    
    id = db.Column(db.Integer, primary_key=True)
    report_type = db.Column(db.String(50), nullable=False)
    generated_by = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    report_data = db.Column(db.JSON)
    file_url = db.Column(db.String(500))
    file_format = db.Column(db.String(20), default='pdf')
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    user = db.relationship('User', backref='reports')

class Notification(db.Model):
    """Notification model"""
    __tablename__ = 'notifications'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    notification_type = db.Column(db.String(50), nullable=False)
    message = db.Column(db.Text, nullable=False)
    is_read = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    user = db.relationship('User', backref='notifications')

class AuditLog(db.Model):
    """Audit Log model"""
    __tablename__ = 'audit_logs'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    action = db.Column(db.String(255), nullable=False)
    entity_type = db.Column(db.String(100))
    entity_id = db.Column(db.Integer)
    changes = db.Column(db.JSON)
    ip_address = db.Column(db.String(45))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    user = db.relationship('User', backref='audit_logs')

class ModelPerformance(db.Model):
    """Model Performance model"""
    __tablename__ = 'model_performance'
    
    id = db.Column(db.Integer, primary_key=True)
    model_version = db.Column(db.String(50), nullable=False)
    test_accuracy = db.Column(db.Float)
    test_loss = db.Column(db.Float)
    inference_time = db.Column(db.Float)
    total_predictions = db.Column(db.Integer, default=0)
    correct_predictions = db.Column(db.Integer, default=0)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class Inventory(db.Model):
    """Inventory model"""
    __tablename__ = 'inventory'
    
    id = db.Column(db.Integer, primary_key=True)
    collection_center_id = db.Column(db.Integer, db.ForeignKey('collection_centers.id'), nullable=False)
    item_type = db.Column(db.String(100), nullable=False)
    quantity = db.Column(db.Integer, default=0)
    total_weight = db.Column(db.Float, default=0)
    total_value = db.Column(db.Float, default=0)
    last_updated = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    collection_center = db.relationship('CollectionCenter', backref='inventory')
