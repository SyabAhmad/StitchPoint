from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, ProductAnalytics, Product, User, Store, Review, Comment
from sqlalchemy import func, desc, extract
from sqlalchemy.sql import case
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

@analytics_bp.route('/reviews-overview', methods=['GET'])
@jwt_required()
def get_reviews_overview():
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

    # Total reviews
    reviews_query = db.session.query(func.count(Review.id)).filter(
        Review.created_at >= start_date
    )
    if store_filter:
        reviews_query = reviews_query.join(Product).filter(Product.store_id == store_filter)
    total_reviews = reviews_query.scalar() or 0

    # Average rating
    rating_query = db.session.query(func.avg(Review.rating)).filter(
        Review.created_at >= start_date
    )
    if store_filter:
        rating_query = rating_query.join(Product).filter(Product.store_id == store_filter)
    avg_rating = rating_query.scalar() or 0

    # Total comments
    comments_query = db.session.query(func.count(Comment.id)).filter(
        Comment.created_at >= start_date
    )
    if store_filter:
        comments_query = comments_query.join(Product).filter(Product.store_id == store_filter)
    total_comments = comments_query.scalar() or 0

    # Average comments per product
    product_count_query = db.session.query(func.count(func.distinct(Product.id)))
    if store_filter:
        product_count_query = product_count_query.filter(Product.store_id == store_filter)
    total_products = product_count_query.scalar() or 1  # Avoid division by zero
    avg_comments_per_product = round(total_comments / total_products, 2)

    return jsonify({
        'reviews_overview': {
            'total_reviews': total_reviews,
            'avg_rating': round(avg_rating, 2),
            'total_comments': total_comments,
            'avg_comments_per_product': avg_comments_per_product
        }
    }), 200

@analytics_bp.route('/reviews-trends', methods=['GET'])
@jwt_required()
def get_reviews_trends():
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

    # Reviews over time (daily)
    reviews_trends_query = db.session.query(
        func.date(Review.created_at).label('date'),
        func.count(Review.id).label('reviews')
    ).filter(Review.created_at >= start_date)

    if store_filter:
        reviews_trends_query = reviews_trends_query.join(Product).filter(Product.store_id == store_filter)

    reviews_trends_query = reviews_trends_query.group_by(func.date(Review.created_at)).order_by('date')

    reviews_trends = []
    for row in reviews_trends_query.all():
        reviews_trends.append({
            'date': row.date.isoformat(),
            'reviews': row.reviews
        })

    return jsonify({'reviews_trends': reviews_trends}), 200

@analytics_bp.route('/comments-overview', methods=['GET'])
@jwt_required()
def get_comments_overview():
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

    # Total comments
    comments_query = db.session.query(func.count(Comment.id)).filter(
        Comment.created_at >= start_date
    )
    if store_filter:
        comments_query = comments_query.join(Product).filter(Product.store_id == store_filter)
    total_comments = comments_query.scalar() or 0

    # Average comments per product
    product_count_query = db.session.query(func.count(func.distinct(Product.id)))
    if store_filter:
        product_count_query = product_count_query.filter(Product.store_id == store_filter)
    total_products = product_count_query.scalar() or 1
    avg_comments_per_product = round(total_comments / total_products, 2)

    return jsonify({
        'comments_overview': {
            'total_comments': total_comments,
            'avg_comments_per_product': avg_comments_per_product
        }
    }), 200

@analytics_bp.route('/comments-trends', methods=['GET'])
@jwt_required()
def get_comments_trends():
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

    # Comments over time (daily)
    comments_trends_query = db.session.query(
        func.date(Comment.created_at).label('date'),
        func.count(Comment.id).label('comments')
    ).filter(Comment.created_at >= start_date)

    if store_filter:
        comments_trends_query = comments_trends_query.join(Product).filter(Product.store_id == store_filter)

    comments_trends_query = comments_trends_query.group_by(func.date(Comment.created_at)).order_by('date')

    comments_trends = []
    for row in comments_trends_query.all():
        comments_trends.append({
            'date': row.date.isoformat(),
            'comments': row.comments
        })

    return jsonify({'comments_trends': comments_trends}), 200

@analytics_bp.route('/products-analytics', methods=['GET'])
@jwt_required()
def get_products_analytics():
    try:
        user_id = int(get_jwt_identity())
    except (TypeError, ValueError):
        return jsonify({'message': 'Invalid token identity'}), 422
    user = User.query.get(user_id)

    if not user or user.role not in ['manager', 'super_admin']:
        return jsonify({'message': 'Unauthorized'}), 403

    days = request.args.get('days', 30, type=int)
    start_date = datetime.utcnow() - timedelta(days=days)

    # Pagination parameters
    page = request.args.get('page', 1, type=int)
    limit = request.args.get('limit', 10, type=int)
    offset = (page - 1) * limit

    # Store filter
    store_id = request.args.get('store_id', type=int)

    # For managers, filter by their store; for super_admin, allow store_id filter
    store_filter = None
    if user.role == 'manager' and user.store:
        store_filter = user.store.id
    elif user.role == 'super_admin' and store_id:
        store_filter = store_id

    # Query products with analytics
    query = db.session.query(
        Product.id,
        Product.name,
        Product.store_id,
        Store.name.label('store_name'),
        func.count(ProductAnalytics.id).label('total_views'),
        func.sum(case((ProductAnalytics.action == 'click', 1), else_=0)).label('total_clicks'),
        func.sum(case((ProductAnalytics.action == 'add_to_cart', 1), else_=0)).label('total_cart_adds'),
        func.avg(case((ProductAnalytics.action == 'view', ProductAnalytics.time_spent), else_=None)).label('avg_time_spent'),
        func.count(func.distinct(Review.id)).label('total_reviews'),
        func.avg(Review.rating).label('avg_rating'),
        func.count(func.distinct(Comment.id)).label('total_comments')
    ).outerjoin(ProductAnalytics, Product.id == ProductAnalytics.product_id)\
     .outerjoin(Store, Product.store_id == Store.id)\
     .outerjoin(Review, Product.id == Review.product_id)\
     .outerjoin(Comment, Product.id == Comment.product_id)\
     .filter(ProductAnalytics.timestamp >= start_date if ProductAnalytics.timestamp else True)

    if store_filter:
        query = query.filter(Product.store_id == store_filter)

    query = query.group_by(Product.id, Product.name, Product.store_id, Store.name).order_by(desc('total_views'))

    # Get total count for pagination
    total_count = query.count()

    # Apply pagination
    query = query.offset(offset).limit(limit)

    results = query.all()

    data = []
    for row in results:
        data.append({
            'product_id': row.id,
            'product_name': row.name,
            'store_id': row.store_id,
            'store_name': row.store_name,
            'total_views': row.total_views or 0,
            'total_clicks': row.total_clicks or 0,
            'total_cart_adds': row.total_cart_adds or 0,
            'avg_time_spent': round(row.avg_time_spent or 0, 2),
            'total_reviews': row.total_reviews or 0,
            'avg_rating': round(row.avg_rating or 0, 2),
            'total_comments': row.total_comments or 0
        })

    return jsonify({
        'products_analytics': data,
        'pagination': {
            'page': page,
            'limit': limit,
            'total': total_count,
            'pages': (total_count + limit - 1) // limit
        }
    }), 200

@analytics_bp.route('/stores-analytics', methods=['GET'])
@jwt_required()
def get_stores_analytics():
    try:
        user_id = int(get_jwt_identity())
    except (TypeError, ValueError):
        return jsonify({'message': 'Invalid token identity'}), 422
    user = User.query.get(user_id)

    if not user or user.role not in ['manager', 'super_admin']:
        return jsonify({'message': 'Unauthorized'}), 403

    days = request.args.get('days', 30, type=int)
    start_date = datetime.utcnow() - timedelta(days=days)

    # For managers, only their store; for super_admin, all stores
    store_filter = None
    if user.role == 'manager' and user.store:
        store_filter = user.store.id

    # Query stores with analytics
    query = db.session.query(
        Store.id,
        Store.name,
        func.count(func.distinct(Product.id)).label('total_products'),
        func.count(ProductAnalytics.id).label('total_views'),
        func.sum(case((ProductAnalytics.action == 'click', 1), else_=0)).label('total_clicks'),
        func.sum(case((ProductAnalytics.action == 'add_to_cart', 1), else_=0)).label('total_cart_adds'),
        func.avg(case((ProductAnalytics.action == 'view', ProductAnalytics.time_spent), else_=None)).label('avg_time_spent'),
        func.count(func.distinct(Review.id)).label('total_reviews'),
        func.avg(Review.rating).label('avg_rating'),
        func.count(func.distinct(Comment.id)).label('total_comments')
    ).outerjoin(Product, Store.id == Product.store_id)\
     .outerjoin(ProductAnalytics, Product.id == ProductAnalytics.product_id)\
     .outerjoin(Review, Product.id == Review.product_id)\
     .outerjoin(Comment, Product.id == Comment.product_id)\
     .filter(ProductAnalytics.timestamp >= start_date if ProductAnalytics.timestamp else True)

    if store_filter:
        query = query.filter(Store.id == store_filter)

    query = query.group_by(Store.id, Store.name).order_by(desc('total_views'))

    results = query.all()

    data = []
    for row in results:
        data.append({
            'store_id': row.id,
            'store_name': row.name,
            'total_products': row.total_products or 0,
            'total_views': row.total_views or 0,
            'total_clicks': row.total_clicks or 0,
            'total_cart_adds': row.total_cart_adds or 0,
            'avg_time_spent': round(row.avg_time_spent or 0, 2),
            'total_reviews': row.total_reviews or 0,
            'avg_rating': round(row.avg_rating or 0, 2),
            'total_comments': row.total_comments or 0
        })

    return jsonify({'stores_analytics': data}), 200


@analytics_bp.route('/stores-analytics/<int:store_id>', methods=['GET'])
@jwt_required()
def get_store_analytics(store_id):
    try:
        user_id = int(get_jwt_identity())
    except (TypeError, ValueError):
        return jsonify({'message': 'Invalid token identity'}), 422
    user = User.query.get(user_id)

    if not user or user.role not in ['manager', 'super_admin']:
        return jsonify({'message': 'Unauthorized'}), 403

    # Managers may only access their own store
    if user.role == 'manager' and user.store and user.store.id != store_id:
        return jsonify({'message': 'Unauthorized for this store'}), 403

    days = request.args.get('days', 30, type=int)
    start_date = datetime.utcnow() - timedelta(days=days)

    # Query single store analytics
    row = db.session.query(
        Store.id,
        Store.name,
        func.count(func.distinct(Product.id)).label('total_products'),
        func.count(ProductAnalytics.id).label('total_views'),
        func.sum(case((ProductAnalytics.action == 'click', 1), else_=0)).label('total_clicks'),
        func.sum(case((ProductAnalytics.action == 'add_to_cart', 1), else_=0)).label('total_cart_adds'),
        func.avg(case((ProductAnalytics.action == 'view', ProductAnalytics.time_spent), else_=None)).label('avg_time_spent'),
        func.count(func.distinct(Review.id)).label('total_reviews'),
        func.avg(Review.rating).label('avg_rating'),
        func.count(func.distinct(Comment.id)).label('total_comments')
    ) \
    .outerjoin(Product, Store.id == Product.store_id) \
    .outerjoin(ProductAnalytics, Product.id == ProductAnalytics.product_id) \
    .outerjoin(Review, Product.id == Review.product_id) \
    .outerjoin(Comment, Product.id == Comment.product_id) \
    .filter(Store.id == store_id) \
    .filter(ProductAnalytics.timestamp >= start_date if ProductAnalytics.timestamp else True) \
    .group_by(Store.id, Store.name) \
    .first()

    if not row:
        return jsonify({'message': 'Store not found'}), 404

    store_data = {
        'store_id': row.id,
        'store_name': row.name,
        'total_products': row.total_products or 0,
        'total_views': row.total_views or 0,
        'total_clicks': row.total_clicks or 0,
        'total_cart_adds': row.total_cart_adds or 0,
        'avg_time_spent': round(row.avg_time_spent or 0, 2),
        'total_reviews': row.total_reviews or 0,
        'avg_rating': round(row.avg_rating or 0, 2),
        'total_comments': row.total_comments or 0
    }

    return jsonify({'store': store_data}), 200


@analytics_bp.route('/products-by-store', methods=['GET'])
@jwt_required()
def get_products_by_store():
    try:
        user_id = int(get_jwt_identity())
    except (TypeError, ValueError):
        return jsonify({'message': 'Invalid token identity'}), 422
    user = User.query.get(user_id)

    if not user or user.role not in ['manager', 'super_admin']:
        return jsonify({'message': 'Unauthorized'}), 403

    days = request.args.get('days', 30, type=int)
    start_date = datetime.utcnow() - timedelta(days=days)

    store_id = request.args.get('store_id', type=int)
    # For managers, default to their store
    if user.role == 'manager' and user.store:
        store_id = user.store.id

    if not store_id:
        return jsonify({'message': 'store_id is required'}), 400

    # Query products for the given store
    query = db.session.query(
        Product.id,
        Product.name,
        Product.store_id,
        func.count(ProductAnalytics.id).label('total_views'),
        func.sum(case((ProductAnalytics.action == 'click', 1), else_=0)).label('total_clicks'),
        func.sum(case((ProductAnalytics.action == 'add_to_cart', 1), else_=0)).label('total_cart_adds'),
        func.avg(case((ProductAnalytics.action == 'view', ProductAnalytics.time_spent), else_=None)).label('avg_time_spent'),
        func.count(func.distinct(Review.id)).label('total_reviews'),
        func.avg(Review.rating).label('avg_rating'),
        func.count(func.distinct(Comment.id)).label('total_comments')
    ) \
    .outerjoin(ProductAnalytics, Product.id == ProductAnalytics.product_id) \
    .outerjoin(Review, Product.id == Review.product_id) \
    .outerjoin(Comment, Product.id == Comment.product_id) \
    .filter(Product.store_id == store_id) \
    .filter(ProductAnalytics.timestamp >= start_date if ProductAnalytics.timestamp else True) \
    .group_by(Product.id, Product.name, Product.store_id) \
    .order_by(desc('total_views'))

    results = query.all()

    data = []
    for row in results:
        data.append({
            'product_id': row.id,
            'product_name': row.name,
            'store_id': row.store_id,
            'total_views': row.total_views or 0,
            'total_clicks': row.total_clicks or 0,
            'total_cart_adds': row.total_cart_adds or 0,
            'avg_time_spent': round(row.avg_time_spent or 0, 2),
            'total_reviews': row.total_reviews or 0,
            'avg_rating': round(row.avg_rating or 0, 2),
            'total_comments': row.total_comments or 0
        })

    return jsonify({'products': data}), 200

@analytics_bp.route('/comments', methods=['GET'])
@jwt_required()
def get_all_comments():
    try:
        user_id = int(get_jwt_identity())
    except (TypeError, ValueError):
        return jsonify({'message': 'Invalid token identity'}), 422
    user = User.query.get(user_id)

    if not user or user.role not in ['manager', 'super_admin']:
        return jsonify({'message': 'Unauthorized'}), 403

    days = request.args.get('days', 30, type=int)
    start_date = datetime.utcnow() - timedelta(days=days)

    # Pagination parameters
    page = request.args.get('page', 1, type=int)
    limit = request.args.get('limit', 10, type=int)
    offset = (page - 1) * limit

    store_filter = None
    if user.role == 'manager' and user.store:
        store_filter = user.store.id

    query = db.session.query(
        Comment.id,
        Comment.comment,
        Comment.created_at,
        User.name.label('user_name'),
        User.email.label('user_email'),
        Product.name.label('product_name'),
        Store.name.label('store_name')
    ).join(User, Comment.user_id == User.id)\
     .join(Product, Comment.product_id == Product.id)\
     .join(Store, Product.store_id == Store.id)\
     .filter(Comment.created_at >= start_date)

    if store_filter:
        query = query.filter(Product.store_id == store_filter)

    query = query.order_by(desc(Comment.created_at))

    # Get total count for pagination
    total_count = query.count()

    # Apply pagination
    query = query.offset(offset).limit(limit)

    results = query.all()

    data = []
    for row in results:
        data.append({
            'id': row.id,
            'content': row.comment,
            'created_at': row.created_at.isoformat(),
            'user_name': row.user_name,
            'user_email': row.user_email,
            'product_name': row.product_name,
            'store_name': row.store_name
        })

    return jsonify({
        'comments': data,
        'pagination': {
            'page': page,
            'limit': limit,
            'total': total_count,
            'pages': (total_count + limit - 1) // limit
        }
    }), 200

@analytics_bp.route('/reviews', methods=['GET'])
@jwt_required()
def get_all_reviews():
    try:
        user_id = int(get_jwt_identity())
    except (TypeError, ValueError):
        return jsonify({'message': 'Invalid token identity'}), 422
    user = User.query.get(user_id)

    if not user or user.role not in ['manager', 'super_admin']:
        return jsonify({'message': 'Unauthorized'}), 403

    days = request.args.get('days', 30, type=int)
    start_date = datetime.utcnow() - timedelta(days=days)

    # Pagination parameters
    page = request.args.get('page', 1, type=int)
    limit = request.args.get('limit', 10, type=int)
    offset = (page - 1) * limit

    # Search parameter
    search = request.args.get('search', '').strip()

    # Rating filter
    rating_filter = request.args.get('rating_filter', 'all')  # 'all', 'high', 'low'

    store_filter = None
    if user.role == 'manager' and user.store:
        store_filter = user.store.id

    query = db.session.query(
        Review.id,
        Review.rating,
        Review.comment,
        Review.created_at,
        User.name.label('user_name'),
        User.email.label('user_email'),
        Product.name.label('product_name'),
        Store.name.label('store_name')
    ).join(User, Review.user_id == User.id)\
     .join(Product, Review.product_id == Product.id)\
     .join(Store, Product.store_id == Store.id)\
     .filter(Review.created_at >= start_date)

    if store_filter:
        query = query.filter(Product.store_id == store_filter)

    # Apply search filter
    if search:
        query = query.filter(
            db.or_(
                Review.comment.ilike(f'%{search}%'),
                User.name.ilike(f'%{search}%'),
                User.email.ilike(f'%{search}%'),
                Product.name.ilike(f'%{search}%'),
                Store.name.ilike(f'%{search}%')
            )
        )

    # Apply rating filter
    if rating_filter == 'high':
        query = query.filter(Review.rating >= 4)
    elif rating_filter == 'low':
        query = query.filter(Review.rating <= 2)

    # Get total count for pagination
    total_count = query.count()

    # Apply ordering and pagination
    query = query.order_by(desc(Review.created_at)).offset(offset).limit(limit)

    results = query.all()

    data = []
    for row in results:
        data.append({
            'id': row.id,
            'rating': row.rating,
            'comment': row.comment,
            'created_at': row.created_at.isoformat(),
            'user_name': row.user_name,
            'user_email': row.user_email,
            'product_name': row.product_name,
            'store_name': row.store_name
        })

    return jsonify({
        'reviews': data,
        'pagination': {
            'page': page,
            'limit': limit,
            'total': total_count,
            'pages': (total_count + limit - 1) // limit
        }
    }), 200

@analytics_bp.route('/reviews/<int:review_id>', methods=['GET'])
@jwt_required()
def get_review_details(review_id):
    try:
        user_id = int(get_jwt_identity())
    except (TypeError, ValueError):
        return jsonify({'message': 'Invalid token identity'}), 422
    user = User.query.get(user_id)

    if not user or user.role not in ['manager', 'super_admin']:
        return jsonify({'message': 'Unauthorized'}), 403

    # Fetch the review with related data
    review = db.session.query(
        Review.id,
        Review.rating,
        Review.comment,
        Review.created_at,
        User.name.label('user_name'),
        User.email.label('user_email'),
        Product.id.label('product_id'),
        Product.name.label('product_name'),
        Store.id.label('store_id'),
        Store.name.label('store_name')
    ).join(User, Review.user_id == User.id)\
     .join(Product, Review.product_id == Product.id)\
     .join(Store, Product.store_id == Store.id)\
     .filter(Review.id == review_id)\
     .first()

    if not review:
        return jsonify({'message': 'Review not found'}), 404

    # Check if manager can access this review (only their store's reviews)
    if user.role == 'manager' and user.store and user.store.id != review.store_id:
        return jsonify({'message': 'Unauthorized for this review'}), 403

    review_data = {
        'id': review.id,
        'rating': review.rating,
        'comment': review.comment,
        'created_at': review.created_at.isoformat(),
        'user_name': review.user_name,
        'user_email': review.user_email,
        'product_id': review.product_id,
        'product_name': review.product_name,
        'store_id': review.store_id,
        'store_name': review.store_name
    }

    return jsonify({'review': review_data}), 200

@analytics_bp.route('/welcome', methods=['GET'])
def welcome():
    """
    Returns a welcome message
    """
    logger.info(f"Request received: {request.method} {request.path}")
    return jsonify({'message': 'Welcome to the Flask API Service!'})
