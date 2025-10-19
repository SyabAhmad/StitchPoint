from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, create_refresh_token, jwt_required, get_jwt_identity
from db import db
from db.models import User
import re

auth_bp = Blueprint('auth', __name__)

def validate_email(email):
    """Validate email format"""
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return re.match(pattern, email) is not None

def validate_password(password):
    """Validate password strength"""
    if len(password) < 8:
        return False, "Password must be at least 8 characters"
    if not any(char.isupper() for char in password):
        return False, "Password must contain at least one uppercase letter"
    if not any(char.isdigit() for char in password):
        return False, "Password must contain at least one digit"
    return True, ""

@auth_bp.route('/register', methods=['POST'])
def register():
    """Register new user with role selection (customer or seller)"""
    data = request.get_json()
    
    # Validation
    if not data or not all(key in data for key in ['username', 'email', 'password', 'role']):
        return {'error': 'Missing required fields: username, email, password, role'}, 400
    
    username = data.get('username', '').strip()
    email = data.get('email', '').strip()
    password = data.get('password', '')
    role = data.get('role', 'customer').lower()
    first_name = data.get('first_name', '').strip()
    last_name = data.get('last_name', '').strip()
    store_name = data.get('store_name', '').strip()
    store_description = data.get('store_description', '').strip()
    
    # Validate role
    if role not in ['customer', 'seller']:
        return {'error': 'Role must be either "customer" or "seller"'}, 400
    
    # Validate seller fields
    if role == 'seller' and not store_name:
        return {'error': 'Store name is required for sellers'}, 400
    
    # Validate email
    if not validate_email(email):
        return {'error': 'Invalid email format'}, 400
    
    # Validate password
    is_valid, msg = validate_password(password)
    if not is_valid:
        return {'error': msg}, 400
    
    # Check if user exists
    if User.query.filter_by(username=username).first():
        return {'error': 'Username already exists'}, 409
    
    if User.query.filter_by(email=email).first():
        return {'error': 'Email already exists'}, 409
    
    # Create user
    try:
        user = User(
            username=username,
            email=email,
            first_name=first_name,
            last_name=last_name,
            role=role,
            store_name=store_name if role == 'seller' else None,
            store_description=store_description if role == 'seller' else None,
        )
        user.set_password(password)
        
        db.session.add(user)
        db.session.commit()
        
        # Create tokens
        access_token = create_access_token(identity=user.id)
        refresh_token = create_refresh_token(identity=user.id)
        
        return {
            'message': 'User created successfully',
            'access_token': access_token,
            'refresh_token': refresh_token,
            'user': user.to_dict()
        }, 201
    except Exception as e:
        db.session.rollback()
        return {'error': str(e)}, 500


@auth_bp.route('/login', methods=['POST'])
def login():
    """Login user with username or email"""
    data = request.get_json()
    
    if not data or 'password' not in data:
        return {'error': 'Missing password'}, 400
    
    username = data.get('username', '').strip()
    password = data.get('password', '')
    
    if not username:
        return {'error': 'Missing username or email'}, 400
    
    # Find user by username or email
    user = User.query.filter(
        (User.username == username) | (User.email == username)
    ).first()
    
    if not user or not user.check_password(password):
        return {'error': 'Invalid username/email or password'}, 401
    
    if not user.is_active:
        return {'error': 'User account is inactive'}, 403
    
    # Create tokens
    access_token = create_access_token(identity=user.id)
    refresh_token = create_refresh_token(identity=user.id)
    
    return {
        'message': 'Login successful',
        'access_token': access_token,
        'refresh_token': refresh_token,
        'user': user.to_dict()
    }, 200


@auth_bp.route('/refresh', methods=['POST'])
@jwt_required(refresh=True)
def refresh():
    """Refresh access token"""
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    
    if not user or not user.is_active:
        return {'error': 'User not found or inactive'}, 401
    
    access_token = create_access_token(identity=user_id)
    
    return {
        'access_token': access_token,
        'user': user.to_dict()
    }, 200


@auth_bp.route('/me', methods=['GET'])
@jwt_required()
def get_current_user():
    """Get current authenticated user"""
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    
    if not user:
        return {'error': 'User not found'}, 404
    
    return {'user': user.to_dict()}, 200


@auth_bp.route('/logout', methods=['POST'])
@jwt_required()
def logout():
    """Logout user (token is invalidated on client side)"""
    return {'message': 'Logout successful'}, 200
