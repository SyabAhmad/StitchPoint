from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, User, Order, Product, PageView, ButtonClick
from sqlalchemy import func

dashboard_bp = Blueprint('dashboard', __name__)

@dashboard_bp.route('/customer', methods=['GET'])
@jwt_required()
def customer_dashboard():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)

    if not user or user.role != 'customer':
        return jsonify({'message': 'Unauthorized'}), 403

    # Get user's orders
    orders = Order.query.filter_by(user_id=user_id).order_by(Order.created_at.desc()).limit(5).all()
    orders_data = [{
        'id': order.id,
        'total_amount': order.total_amount,
        'status': order.status,
        'created_at': order.created_at.isoformat()
    } for order in orders]

    # Get user's cart items count
    cart = user.carts[0] if user.carts else None
    cart_count = sum(item.quantity for item in cart.items) if cart else 0

    # Get user's wishlist items count
    wishlist = user.wishlists[0] if user.wishlists else None
    wishlist_count = len(wishlist.items) if wishlist else 0

    return jsonify({
        'user': {
            'id': user.id,
            'name': user.name,
            'email': user.email
        },
        'orders': orders_data,
        'cart_count': cart_count,
        'wishlist_count': wishlist_count
    }), 200

@dashboard_bp.route('/admin', methods=['GET'])
@jwt_required()
def admin_dashboard():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)

    if not user or user.role not in ['manager', 'super_admin']:
        return jsonify({'message': 'Unauthorized'}), 403

    # Total users
    total_users = User.query.count()

    # Total products
    total_products = Product.query.count()

    # Total orders
    total_orders = Order.query.count()

    # Recent orders
    recent_orders = Order.query.order_by(Order.created_at.desc()).limit(10).all()
    orders_data = [{
        'id': order.id,
        'user_email': order.user.email,
        'total_amount': order.total_amount,
        'status': order.status,
        'created_at': order.created_at.isoformat()
    } for order in recent_orders]

    # Analytics data
    page_views_today = PageView.query.filter(func.date(PageView.viewed_at) == func.date(func.now())).count()
    button_clicks_today = ButtonClick.query.filter(func.date(ButtonClick.clicked_at) == func.date(func.now())).count()

    return jsonify({
        'analytics': {
            'total_users': total_users,
            'total_products': total_products,
            'total_orders': total_orders,
            'page_views_today': page_views_today,
            'button_clicks_today': button_clicks_today
        },
        'recent_orders': orders_data
    }), 200

@dashboard_bp.route('/users', methods=['GET'])
@jwt_required()
def get_users():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)

    if not user or user.role != 'super_admin':
        return jsonify({'message': 'Unauthorized'}), 403

    users = User.query.all()
    users_data = [{
        'id': u.id,
        'name': u.name,
        'email': u.email,
        'role': u.role,
        'created_at': u.created_at.isoformat()
    } for u in users]

    return jsonify({'users': users_data}), 200

@dashboard_bp.route('/users/<int:user_id>/role', methods=['PUT'])
@jwt_required()
def update_user_role(user_id):
    current_user_id = get_jwt_identity()
    current_user = User.query.get(current_user_id)

    if not current_user or current_user.role != 'super_admin':
        return jsonify({'message': 'Unauthorized'}), 403

    data = request.get_json()
    new_role = data.get('role')

    if new_role not in ['customer', 'manager', 'super_admin']:
        return jsonify({'message': 'Invalid role'}), 400

    user = User.query.get(user_id)
    if not user:
        return jsonify({'message': 'User not found'}), 404

    # Prevent super_admin from demoting themselves
    if user.id == current_user_id and new_role != 'super_admin':
        return jsonify({'message': 'Cannot change your own role'}), 400

    user.role = new_role
    db.session.commit()

    return jsonify({'message': 'Role updated successfully'}), 200
