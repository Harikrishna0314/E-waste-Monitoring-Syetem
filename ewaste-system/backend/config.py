"""Minimal configuration for the database-free E-Waste API."""
import os


class Config:
    MAX_CONTENT_LENGTH = 50 * 1024 * 1024
    UPLOAD_FOLDER = os.path.join(os.path.dirname(__file__), '..', 'uploads')
    YOLO_MODEL_PATH = os.path.join(os.path.dirname(__file__), '..', 'ai', 'models', 'yolov11n.pt')
    ENV = os.getenv('FLASK_ENV', 'development')
    DEBUG = ENV == 'development'


class DevelopmentConfig(Config):
    DEBUG = True


class ProductionConfig(Config):
    DEBUG = False


class TestingConfig(Config):
    TESTING = True


config = {
    'development': DevelopmentConfig,
    'production': ProductionConfig,
    'testing': TestingConfig,
    'default': DevelopmentConfig
}
