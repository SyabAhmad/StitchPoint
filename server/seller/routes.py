from flask import Blueprint, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from db import db
from db.models import User

seller_bp = Blueprint('seller', __name__)

@seller_bp.route('/profile', methods=['PUT'])
@jwt_required()
def update_seller_profile():
    """Update seller store profile"""
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    
    if not user:
        return {'error': 'User not found'}, 404
    
    if user.role not in ['seller', 'admin']:
        return {'error': 'Only sellers can update store profile'}, 403
    
    data = request.get_json()
    
    try:
        # Update personal information
        if 'first_name' in data:
            user.first_name = data['first_name']
        if 'last_name' in data:
            user.last_name = data['last_name']
        if 'phone' in data:
            user.phone = data['phone']
        
        # Update store information
        if 'store_name' in data:
            user.store_name = data['store_name']
        if 'store_description' in data:
            user.store_description = data['store_description']
        
        # Handle store images (base64 encoded)
        if 'store_logo' in data and data['store_logo']:
            if hasattr(user, 'store_logo'):
                user.store_logo = data['store_logo']
        
        if 'store_banner' in data and data['store_banner']:
            if hasattr(user, 'store_banner'):
                user.store_banner = data['store_banner']
        
        db.session.commit()
        
        return {
            'message': 'Store profile updated successfully',
            'user': user.to_dict()
        }, 200
    except Exception as e:
        db.session.rollback()
        return {'error': str(e)}, 500
