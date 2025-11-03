from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, User, Cart, CartItem, Product
from sqlalchemy.exc import IntegrityError

cart_bp = Blueprint('cart', __name__)

@cart_bp.route('', methods=['GET'])
@jwt_required()
def get_cart():
    """Retrieve user's cart items"""
    try:
        user_id = int(get_jwt_identity())
    except (TypeError, ValueError):
        return jsonify({'message': 'Invalid token identity'}), 422

    user = User.query.get(user_id)
    if not user or user.role != 'customer':
        return jsonify({'message': 'Unauthorized'}), 403

    # Get or create user's cart
    cart = user.carts[0] if user.carts else Cart(user_id=user_id)
    if not user.carts:
        db.session.add(cart)
        db.session.commit()

    cart_items = []
    for item in cart.items:
        cart_items.append({
            'id': item.product_id,
            'name': item.product.name,
            'price': item.product.price,
            'image_url': item.product.image_url,
            'store': {
                'id': item.product.store.id,
                'name': item.product.store.name
            } if item.product.store else None,
            'quantity': item.quantity,
        })

    return jsonify({
        'cart_items': cart_items,
        'total_items': sum(item['quantity'] for item in cart_items)
    }), 200

@cart_bp.route('/add', methods=['POST'])
@jwt_required()
def add_to_cart():
    """Add item to cart"""
    try:
        user_id = int(get_jwt_identity())
    except (TypeError, ValueError):
        return jsonify({'message': 'Invalid token identity'}), 422

    user = User.query.get(user_id)
    if not user or user.role != 'customer':
        return jsonify({'message': 'Unauthorized'}), 403

    data = request.get_json() or {}
    product_id = data.get('product_id')
    quantity = data.get('quantity', 1)

    if not product_id:
        return jsonify({'message': 'Product ID is required'}), 400

    if quantity < 1:
        return jsonify({'message': 'Quantity must be at least 1'}), 400

    # Check if product exists
    product = Product.query.get(product_id)
    if not product:
        return jsonify({'message': 'Product not found'}), 404

    # Get or create user's cart
    cart = user.carts[0] if user.carts else Cart(user_id=user_id)
    if not user.carts:
        db.session.add(cart)
        db.session.commit()

    # Check if item already in cart
    existing_item = CartItem.query.filter_by(cart_id=cart.id, product_id=product_id).first()

    try:
        if existing_item:
            existing_item.quantity += quantity
        else:
            new_item = CartItem(cart_id=cart.id, product_id=product_id, quantity=quantity)
            db.session.add(new_item)

        db.session.commit()
        return jsonify({'message': 'Item added to cart successfully'}), 200
    except IntegrityError:
        db.session.rollback()
        return jsonify({'message': 'Failed to add item to cart'}), 500

@cart_bp.route('/update', methods=['PUT'])
@jwt_required()
def update_cart_item():
    """Update item quantity in cart"""
    try:
        user_id = int(get_jwt_identity())
    except (TypeError, ValueError):
        return jsonify({'message': 'Invalid token identity'}), 422

    user = User.query.get(user_id)
    if not user or user.role != 'customer':
        return jsonify({'message': 'Unauthorized'}), 403

    data = request.get_json() or {}
    product_id = data.get('product_id')
    quantity = data.get('quantity')

    if not product_id or quantity is None:
        return jsonify({'message': 'Product ID and quantity are required'}), 400

    if quantity < 0:
        return jsonify({'message': 'Quantity cannot be negative'}), 400

    # Get user's cart
    cart = user.carts[0] if user.carts else None
    if not cart:
        return jsonify({'message': 'Cart not found'}), 404

    # Find cart item
    cart_item = CartItem.query.filter_by(cart_id=cart.id, product_id=product_id).first()
    if not cart_item:
        return jsonify({'message': 'Item not found in cart'}), 404

    try:
        if quantity == 0:
            db.session.delete(cart_item)
        else:
            cart_item.quantity = quantity

        db.session.commit()
        return jsonify({'message': 'Cart item updated successfully'}), 200
    except IntegrityError:
        db.session.rollback()
        return jsonify({'message': 'Failed to update cart item'}), 500

@cart_bp.route('/remove/<int:product_id>', methods=['DELETE'])
@jwt_required()
def remove_from_cart(product_id):
    """Remove item from cart"""
    try:
        user_id = int(get_jwt_identity())
    except (TypeError, ValueError):
        return jsonify({'message': 'Invalid token identity'}), 422

    user = User.query.get(user_id)
    if not user or user.role != 'customer':
        return jsonify({'message': 'Unauthorized'}), 403

    # Get user's cart
    cart = user.carts[0] if user.carts else None
    if not cart:
        return jsonify({'message': 'Cart not found'}), 404

    # Find cart item
    cart_item = CartItem.query.filter_by(cart_id=cart.id, product_id=product_id).first()
    if not cart_item:
        return jsonify({'message': 'Item not found in cart'}), 404

    try:
        db.session.delete(cart_item)
        db.session.commit()
        return jsonify({'message': 'Item removed from cart successfully'}), 200
    except IntegrityError:
        db.session.rollback()
        return jsonify({'message': 'Failed to remove item from cart'}), 500

@cart_bp.route('/clear', methods=['DELETE'])
@jwt_required()
def clear_cart():
    """Clear entire cart"""
    try:
        user_id = int(get_jwt_identity())
    except (TypeError, ValueError):
        return jsonify({'message': 'Invalid token identity'}), 422

    user = User.query.get(user_id)
    if not user or user.role != 'customer':
        return jsonify({'message': 'Unauthorized'}), 403

    # Get user's cart
    cart = user.carts[0] if user.carts else None
    if not cart:
        return jsonify({'message': 'Cart not found'}), 404

    try:
        # Delete all cart items
        CartItem.query.filter_by(cart_id=cart.id).delete()
        db.session.commit()
        return jsonify({'message': 'Cart cleared successfully'}), 200
    except IntegrityError:
        db.session.rollback()
        return jsonify({'message': 'Failed to clear cart'}), 500
