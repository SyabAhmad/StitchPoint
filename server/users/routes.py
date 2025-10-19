from flask import Blueprint, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from db import db
from db.models import User, Cart, CartItem, Product

users_bp = Blueprint('users', __name__)

@users_bp.route('/profile', methods=['GET'])
@jwt_required()
def get_profile():
    """Get user profile"""
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    
    if not user:
        return {'error': 'User not found'}, 404
    
    return {'user': user.to_dict()}, 200


@users_bp.route('/profile', methods=['PUT'])
@jwt_required()
def update_profile():
    """Update user profile"""
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    
    if not user:
        return {'error': 'User not found'}, 404
    
    data = request.get_json()
    
    try:
        if 'first_name' in data:
            user.first_name = data['first_name']
        if 'last_name' in data:
            user.last_name = data['last_name']
        if 'phone' in data:
            user.phone = data['phone']
        if 'avatar_url' in data:
            user.avatar_url = data['avatar_url']
        
        db.session.commit()
        
        return {
            'message': 'Profile updated successfully',
            'user': user.to_dict()
        }, 200
    except Exception as e:
        db.session.rollback()
        return {'error': str(e)}, 500


@users_bp.route('/cart', methods=['GET'])
@jwt_required()
def get_cart():
    """Get user's cart"""
    user_id = get_jwt_identity()
    cart = Cart.query.filter_by(user_id=user_id).first()
    
    if not cart:
        # Create cart if doesn't exist
        cart = Cart(user_id=user_id)
        db.session.add(cart)
        db.session.commit()
    
    return {
        'cart': {
            'id': cart.id,
            'items': [item.to_dict() for item in cart.items],
            'total_items': len(cart.items),
            'subtotal': sum(item.quantity * item.product.final_price for item in cart.items)
        }
    }, 200


@users_bp.route('/cart/add', methods=['POST'])
@jwt_required()
def add_to_cart():
    """Add item to cart"""
    user_id = get_jwt_identity()
    data = request.get_json()
    
    if not data or 'product_id' not in data:
        return {'error': 'Missing product_id'}, 400
    
    product_id = data['product_id']
    quantity = data.get('quantity', 1)
    
    product = Product.query.get(product_id)
    if not product or not product.is_active:
        return {'error': 'Product not found'}, 404
    
    if quantity <= 0 or quantity > product.stock:
        return {'error': 'Invalid quantity'}, 400
    
    try:
        # Get or create cart
        cart = Cart.query.filter_by(user_id=user_id).first()
        if not cart:
            cart = Cart(user_id=user_id)
            db.session.add(cart)
            db.session.flush()
        
        # Check if item already in cart
        cart_item = CartItem.query.filter_by(
            cart_id=cart.id,
            product_id=product_id
        ).first()
        
        if cart_item:
            cart_item.quantity += quantity
        else:
            cart_item = CartItem(
                cart_id=cart.id,
                product_id=product_id,
                quantity=quantity
            )
            db.session.add(cart_item)
        
        db.session.commit()
        
        return {
            'message': 'Item added to cart',
            'cart_item': cart_item.to_dict()
        }, 200
    except Exception as e:
        db.session.rollback()
        return {'error': str(e)}, 500


@users_bp.route('/cart/remove/<item_id>', methods=['DELETE'])
@jwt_required()
def remove_from_cart(item_id):
    """Remove item from cart"""
    user_id = get_jwt_identity()
    
    cart_item = CartItem.query.get(item_id)
    
    if not cart_item:
        return {'error': 'Cart item not found'}, 404
    
    # Verify ownership
    cart = Cart.query.get(cart_item.cart_id)
    if cart.user_id != user_id:
        return {'error': 'Unauthorized'}, 403
    
    try:
        db.session.delete(cart_item)
        db.session.commit()
        
        return {'message': 'Item removed from cart'}, 200
    except Exception as e:
        db.session.rollback()
        return {'error': str(e)}, 500


@users_bp.route('/cart/update/<item_id>', methods=['PUT'])
@jwt_required()
def update_cart_item(item_id):
    """Update cart item quantity"""
    user_id = get_jwt_identity()
    data = request.get_json()
    
    if not data or 'quantity' not in data:
        return {'error': 'Missing quantity'}, 400
    
    quantity = data['quantity']
    
    cart_item = CartItem.query.get(item_id)
    
    if not cart_item:
        return {'error': 'Cart item not found'}, 404
    
    # Verify ownership
    cart = Cart.query.get(cart_item.cart_id)
    if cart.user_id != user_id:
        return {'error': 'Unauthorized'}, 403
    
    if quantity <= 0:
        return {'error': 'Quantity must be greater than 0'}, 400
    
    if quantity > cart_item.product.stock:
        return {'error': 'Not enough stock'}, 400
    
    try:
        cart_item.quantity = quantity
        db.session.commit()
        
        return {
            'message': 'Cart item updated',
            'cart_item': cart_item.to_dict()
        }, 200
    except Exception as e:
        db.session.rollback()
        return {'error': str(e)}, 500


@users_bp.route('/cart/clear', methods=['DELETE'])
@jwt_required()
def clear_cart():
    """Clear entire cart"""
    user_id = get_jwt_identity()
    
    cart = Cart.query.filter_by(user_id=user_id).first()
    
    if not cart:
        return {'error': 'Cart not found'}, 404
    
    try:
        CartItem.query.filter_by(cart_id=cart.id).delete()
        db.session.commit()
        
        return {'message': 'Cart cleared'}, 200
    except Exception as e:
        db.session.rollback()
        return {'error': str(e)}, 500
