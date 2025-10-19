from flask import Blueprint, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from db import db
from db.models import Order, OrderItem, Product, User, Cart, CartItem
import uuid

orders_bp = Blueprint('orders', __name__)

def generate_order_number():
    """Generate unique order number"""
    return f"ORD-{uuid.uuid4().hex[:8].upper()}"

@orders_bp.route('', methods=['GET'])
@jwt_required()
def get_user_orders():
    """Get user's orders"""
    user_id = get_jwt_identity()
    orders = Order.query.filter_by(user_id=user_id).all()
    
    return {
        'orders': [o.to_dict() for o in orders]
    }, 200


@orders_bp.route('/<order_id>', methods=['GET'])
@jwt_required()
def get_order(order_id):
    """Get order details"""
    user_id = get_jwt_identity()
    order = Order.query.get(order_id)
    
    if not order:
        return {'error': 'Order not found'}, 404
    
    if order.user_id != user_id and User.query.get(user_id).role != 'admin':
        return {'error': 'Unauthorized'}, 403
    
    return {'order': order.to_dict()}, 200


@orders_bp.route('', methods=['POST'])
@jwt_required()
def create_order():
    """Create order from cart"""
    user_id = get_jwt_identity()
    data = request.get_json()
    
    if not data or 'items' not in data:
        return {'error': 'Missing items'}, 400
    
    try:
        total_amount = 0
        order_items = []
        
        # Validate and calculate total
        for item_data in data['items']:
            product = Product.query.get(item_data['product_id'])
            
            if not product or not product.is_active:
                return {'error': f'Product not found'}, 404
            
            if product.stock < item_data['quantity']:
                return {'error': f'Not enough stock for {product.title}'}, 400
            
            quantity = item_data['quantity']
            price = product.final_price
            total_amount += price * quantity
            order_items.append({
                'product': product,
                'quantity': quantity,
                'price': price
            })
        
        # Create order
        order = Order(
            order_number=generate_order_number(),
            user_id=user_id,
            total_amount=total_amount,
            shipping_address=data.get('shipping_address', ''),
            notes=data.get('notes', '')
        )
        
        db.session.add(order)
        db.session.flush()  # Get order ID
        
        # Add order items and reduce stock
        for item in order_items:
            order_item = OrderItem(
                order_id=order.id,
                product_id=item['product'].id,
                quantity=item['quantity'],
                price_at_purchase=item['price']
            )
            item['product'].stock -= item['quantity']
            db.session.add(order_item)
        
        # Clear user's cart
        cart = Cart.query.filter_by(user_id=user_id).first()
        if cart:
            CartItem.query.filter_by(cart_id=cart.id).delete()
        
        db.session.commit()
        
        return {
            'message': 'Order created successfully',
            'order': order.to_dict()
        }, 201
    except Exception as e:
        db.session.rollback()
        return {'error': str(e)}, 500


@orders_bp.route('/<order_id>/status', methods=['PUT'])
@jwt_required()
def update_order_status(order_id):
    """Update order status (admin only)"""
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    
    if not user or user.role != 'admin':
        return {'error': 'Unauthorized'}, 403
    
    order = Order.query.get(order_id)
    
    if not order:
        return {'error': 'Order not found'}, 404
    
    data = request.get_json()
    new_status = data.get('status')
    
    valid_statuses = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled']
    if new_status not in valid_statuses:
        return {'error': 'Invalid status'}, 400
    
    try:
        order.status = new_status
        
        if new_status == 'shipped':
            order.tracking_number = data.get('tracking_number')
        
        db.session.commit()
        
        return {
            'message': 'Order status updated',
            'order': order.to_dict()
        }, 200
    except Exception as e:
        db.session.rollback()
        return {'error': str(e)}, 500


@orders_bp.route('/<order_id>/cancel', methods=['POST'])
@jwt_required()
def cancel_order(order_id):
    """Cancel order"""
    user_id = get_jwt_identity()
    order = Order.query.get(order_id)
    
    if not order:
        return {'error': 'Order not found'}, 404
    
    if order.user_id != user_id and User.query.get(user_id).role != 'admin':
        return {'error': 'Unauthorized'}, 403
    
    if order.status not in ['pending', 'confirmed']:
        return {'error': 'Cannot cancel order in current status'}, 400
    
    try:
        # Restore stock
        for item in order.items:
            item.product.stock += item.quantity
        
        order.status = 'cancelled'
        db.session.commit()
        
        return {
            'message': 'Order cancelled successfully',
            'order': order.to_dict()
        }, 200
    except Exception as e:
        db.session.rollback()
        return {'error': str(e)}, 500
