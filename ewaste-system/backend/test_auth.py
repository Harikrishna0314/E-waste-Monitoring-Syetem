"""
Unit tests for authentication module
"""
import pytest
from app import create_app, db
from models import User
from auth import hash_password, verify_password, generate_token, verify_token


@pytest.fixture
def app():
    """Create and configure a test app."""
    app = create_app('testing')
    
    with app.app_context():
        db.create_all()
        yield app
        db.session.remove()
        db.drop_all()


@pytest.fixture
def client(app):
    """A test client for the app."""
    return app.test_client()


@pytest.fixture
def runner(app):
    """A test runner for the app's CLI."""
    return app.test_cli_runner()


class TestPasswordHashing:
    """Test password hashing functions."""
    
    def test_hash_password(self):
        """Test password hashing."""
        password = "SecurePassword123"
        hashed = hash_password(password)
        
        assert hashed != password
        assert len(hashed) > 0
    
    def test_verify_password_correct(self):
        """Test password verification with correct password."""
        password = "SecurePassword123"
        hashed = hash_password(password)
        
        assert verify_password(password, hashed) is True
    
    def test_verify_password_incorrect(self):
        """Test password verification with incorrect password."""
        password = "SecurePassword123"
        wrong_password = "WrongPassword456"
        hashed = hash_password(password)
        
        assert verify_password(wrong_password, hashed) is False


class TestJWTToken:
    """Test JWT token functions."""
    
    def test_generate_token(self, app):
        """Test token generation."""
        with app.app_context():
            token = generate_token(user_id=1, role='user')
            
            assert token is not None
            assert isinstance(token, str)
            assert len(token) > 0
    
    def test_verify_token_valid(self, app):
        """Test token verification with valid token."""
        with app.app_context():
            token = generate_token(user_id=1, role='user')
            payload = verify_token(token)
            
            assert payload is not None
            assert payload['user_id'] == 1
            assert payload['role'] == 'user'
    
    def test_verify_token_invalid(self, app):
        """Test token verification with invalid token."""
        with app.app_context():
            payload = verify_token('invalid_token')
            
            assert payload is None
    
    def test_verify_token_expired(self, app):
        """Test token verification with expired token."""
        from datetime import datetime, timedelta
        import jwt
        
        with app.app_context():
            # Create an expired token
            payload = {
                'user_id': 1,
                'role': 'user',
                'exp': datetime.utcnow() - timedelta(hours=1),
                'iat': datetime.utcnow()
            }
            token = jwt.encode(
                payload,
                app.config['JWT_SECRET_KEY'],
                algorithm='HS256'
            )
            
            result = verify_token(token)
            assert result is None


class TestAuthenticationEndpoints:
    """Test authentication endpoints."""
    
    def test_register_success(self, client, app):
        """Test successful user registration."""
        response = client.post('/api/auth/register', json={
            'email': 'newuser@example.com',
            'password': 'SecurePassword123',
            'full_name': 'New User',
            'role': 'user'
        })
        
        assert response.status_code == 201
        assert 'token' in response.json
        assert response.json['user']['email'] == 'newuser@example.com'
    
    def test_register_missing_fields(self, client):
        """Test registration with missing fields."""
        response = client.post('/api/auth/register', json={
            'email': 'newuser@example.com'
        })
        
        assert response.status_code == 400
        assert 'error' in response.json
    
    def test_register_duplicate_email(self, client, app):
        """Test registration with duplicate email."""
        with app.app_context():
            user = User(
                email='existing@example.com',
                password_hash=hash_password('password'),
                full_name='Existing User',
                role='user'
            )
            db.session.add(user)
            db.session.commit()
        
        response = client.post('/api/auth/register', json={
            'email': 'existing@example.com',
            'password': 'SecurePassword123',
            'full_name': 'New User',
            'role': 'user'
        })
        
        assert response.status_code == 400
        assert 'already exists' in response.json['error']
    
    def test_login_success(self, client, app):
        """Test successful login."""
        with app.app_context():
            user = User(
                email='user@example.com',
                password_hash=hash_password('password'),
                full_name='Test User',
                role='user'
            )
            db.session.add(user)
            db.session.commit()
        
        response = client.post('/api/auth/login', json={
            'email': 'user@example.com',
            'password': 'password'
        })
        
        assert response.status_code == 200
        assert 'token' in response.json
        assert response.json['user']['email'] == 'user@example.com'
    
    def test_login_invalid_credentials(self, client):
        """Test login with invalid credentials."""
        response = client.post('/api/auth/login', json={
            'email': 'nonexistent@example.com',
            'password': 'wrongpassword'
        })
        
        assert response.status_code == 401
        assert 'error' in response.json
    
    def test_login_missing_fields(self, client):
        """Test login with missing fields."""
        response = client.post('/api/auth/login', json={
            'email': 'user@example.com'
        })
        
        assert response.status_code == 400
        assert 'error' in response.json
    
    def test_get_current_user_success(self, client, app):
        """Test getting current user info."""
        with app.app_context():
            user = User(
                email='user@example.com',
                password_hash=hash_password('password'),
                full_name='Test User',
                role='user'
            )
            db.session.add(user)
            db.session.commit()
            
            token = generate_token(user.id, user.role)
        
        response = client.get(
            '/api/auth/me',
            headers={'Authorization': f'Bearer {token}'}
        )
        
        assert response.status_code == 200
        assert response.json['email'] == 'user@example.com'
    
    def test_get_current_user_no_token(self, client):
        """Test getting current user without token."""
        response = client.get('/api/auth/me')
        
        assert response.status_code == 401
        assert 'error' in response.json
    
    def test_get_current_user_invalid_token(self, client):
        """Test getting current user with invalid token."""
        response = client.get(
            '/api/auth/me',
            headers={'Authorization': 'Bearer invalid_token'}
        )
        
        assert response.status_code == 401
        assert 'error' in response.json


class TestHealthCheck:
    """Test health check endpoint."""
    
    def test_health_check(self, client):
        """Test health check endpoint."""
        response = client.get('/api/health')
        
        assert response.status_code == 200
        assert response.json['status'] == 'healthy'


if __name__ == '__main__':
    pytest.main([__file__, '-v'])
