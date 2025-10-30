from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, ProductAnalytics, Product, User, Store
from sqlalchemy import func, desc
from datetime import datetime, timedelta
from logger import setup_logger

analytics_bp = Blueprint('analytics', __name__)
logger = setup_logger()

@analytics_bp.route('/product-views', methods=['GET'])
@jwt_required()
def get_product_views():
    try:
        user_id = int(get_jwt_identity())
    except (TypeError, ValueError):
        return jsonify({'message': 'Invalid token identity'}), 422
    user = User.query.get(user_id)

    if not user or user.role not in ['manager', 'super_admin']:
        return jsonify({'message': 'Unauthorized'}), 403

    # Get date range from query params
    days = request.args.get('days', 30, type=int)
    start_date = datetime.utcnow() - timedelta(days=days)

    # Filter by store for managers
    store_filter = None
    if user.role == 'manager' and user.store:
        store_filter = user.store.id

    # Query product views
    query = db.session.query(
        ProductAnalytics.product_id,
        Product.name,
        Product.store_id,
        func.count(ProductAnalytics.id).label('views'),
        func.avg(ProductAnalytics.time_spent).label('avg_time_spent')
    ).join(Product).filter(
        ProductAnalytics.action == 'view',
        ProductAnalytics.timestamp >= start_date
    )

    if store_filter:
        query = query.filter(Product.store_id == store_filter)

    query = query.group_by(ProductAnalytics.product_id, Product.name, Product.store_id).order_by(desc('views'))

    results = query.all()

    data = []
    for row in results:
        data.append({
            'product_id': row.product_id,
            'product_name': row.name,
            'store_id': row.store_id,
            'views': row.views,
            'avg_time_spent': round(row.avg_time_spent or 0, 2)
        })

    return jsonify({'analytics': data}), 200

@analytics_bp.route('/product-clicks', methods=['GET'])
@jwt_required()
def get_product_clicks():
    try:
        user_id = int(get_jwt_identity())
    except (TypeError, ValueError):
        return jsonify({'message': 'Invalid token identity'}), 422
    user = User.query.get(user_id)

    if not user or user.role not in ['manager', 'super_admin']:
        return jsonify({'message': 'Unauthorized'}), 403

    days = request.args.get('days', 30, type=int)
    start_date = datetime.utcnow() - timedelta(days=days)

    store_filter = None
    if user.role == 'manager' and user.store:
        store_filter = user.store.id

    query = db.session.query(
        ProductAnalytics.product_id,
        Product.name,
        Product.store_id,
        func.count(ProductAnalytics.id).label('clicks')
    ).join(Product).filter(
        ProductAnalytics.action == 'click',
        ProductAnalytics.timestamp >= start_date
    )

    if store_filter:
        query = query.filter(Product.store_id == store_filter)

    query = query.group_by(ProductAnalytics.product_id, Product.name, Product.store_id).order_by(desc('clicks'))

    results = query.all()

    data = []
    for row in results:
        data.append({
            'product_id': row.product_id,
            'product_name': row.name,
            'store_id': row.store_id,
            'clicks': row.clicks
        })

    return jsonify({'analytics': data}), 200

@analytics_bp.route('/overview', methods=['GET'])
@jwt_required()
def get_analytics_overview():
    try:
        user_id = int(get_jwt_identity())
    except (TypeError, ValueError):
        return jsonify({'message': 'Invalid token identity'}), 422
    user = User.query.get(user_id)

    if not user or user.role not in ['manager', 'super_admin']:
        return jsonify({'message': 'Unauthorized'}), 403

    days = request.args.get('days', 30, type=int)
    start_date = datetime.utcnow() - timedelta(days=days)

    store_filter = None
    if user.role == 'manager' and user.store:
        store_filter = user.store.id

    # Total views
    views_query = db.session.query(func.count(ProductAnalytics.id)).filter(
        ProductAnalytics.action == 'view',
        ProductAnalytics.timestamp >= start_date
    )
    if store_filter:
        views_query = views_query.join(Product).filter(Product.store_id == store_filter)
    total_views = views_query.scalar() or 0

    # Total clicks
    clicks_query = db.session.query(func.count(ProductAnalytics.id)).filter(
        ProductAnalytics.action == 'click',
        ProductAnalytics.timestamp >= start_date
    )
    if store_filter:
        clicks_query = clicks_query.join(Product).filter(Product.store_id == store_filter)
    total_clicks = clicks_query.scalar() or 0

    # Total add to cart
    cart_query = db.session.query(func.count(ProductAnalytics.id)).filter(
        ProductAnalytics.action == 'add_to_cart',
        ProductAnalytics.timestamp >= start_date
    )
    if store_filter:
        cart_query = cart_query.join(Product).filter(Product.store_id == store_filter)
    total_cart_adds = cart_query.scalar() or 0

    # Average time spent
    time_query = db.session.query(func.avg(ProductAnalytics.time_spent)).filter(
        ProductAnalytics.action == 'view',
        ProductAnalytics.timestamp >= start_date,
        ProductAnalytics.time_spent.isnot(None)
    )
    if store_filter:
        time_query = time_query.join(Product).filter(Product.store_id == store_filter)
    avg_time_spent = time_query.scalar() or 0

    # Top products by views
    top_products_query = db.session.query(
        ProductAnalytics.product_id,
        Product.name,
        func.count(ProductAnalytics.id).label('views')
    ).join(Product).filter(
        ProductAnalytics.action == 'view',
        ProductAnalytics.timestamp >= start_date
    )

    if store_filter:
        top_products_query = top_products_query.filter(Product.store_id == store_filter)

    top_products_query = top_products_query.group_by(
        ProductAnalytics.product_id, Product.name
    ).order_by(desc('views')).limit(5)

    top_products = []
    for row in top_products_query.all():
        top_products.append({
            'product_id': row.product_id,
            'name': row.name,
            'views': row.views
        })

    return jsonify({
        'overview': {
            'total_views': total_views,
            'total_clicks': total_clicks,
            'total_cart_adds': total_cart_adds,
            'avg_time_spent': round(avg_time_spent, 2),
            'top_products': top_products
        }
    }), 200

@analytics_bp.route('/log', methods=['POST'])
def log_analytics():
    data = request.get_json() or {}

    product_id = data.get('product_id')
    action = data.get('action')
    time_spent = data.get('time_spent')
    referrer = data.get('referrer')
    user_agent = request.headers.get('User-Agent')

    if not product_id or not action:
        return jsonify({'message': 'product_id and action are required'}), 400

    # Try to get user_id from JWT if present
    user_id = None
    try:
        from flask_jwt_extended import verify_jwt_in_request, get_jwt_identity
        verify_jwt_in_request(optional=True)
        identity = get_jwt_identity()
        if identity:
            try:
                user_id = int(identity)
            except Exception:
                user_id = None
    except Exception:
        pass

    # Validate action
    valid_actions = ['view', 'click', 'add_to_cart', 'add_to_wishlist']
    if action not in valid_actions:
        return jsonify({'message': f'Invalid action. Must be one of: {", ".join(valid_actions)}'}), 400

    # Check if product exists
    product = Product.query.get(product_id)
    if not product:
        return jsonify({'message': 'Product not found'}), 404

    # Create analytics entry
    analytics_entry = ProductAnalytics(
        product_id=product_id,
        user_id=user_id,
        action=action,
        time_spent=time_spent,
        referrer=referrer,
        user_agent=user_agent
    )

    db.session.add(analytics_entry)
    db.session.commit()

    return jsonify({'message': 'Analytics logged successfully'}), 201

@analytics_bp.route('/welcome', methods=['GET'])
def welcome():
    """
    Returns a welcome message
    """
    logger.info(f"Request received: {request.method} {request.path}")
    return jsonify({'message': 'Welcome to the Flask API Service!'})
