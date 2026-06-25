from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from werkzeug.security import generate_password_hash
from werkzeug.utils import secure_filename
from models import db, User, Order, Product, PageView, ButtonClick, Review, Comment, Store, OrderItem, Address, PaymentMethod, Cart, CartItem, WishlistItem, Commission, CommissionRate
from sqlalchemy import func
import os
from datetime import datetime, timedelta

dashboard_bp = Blueprint('dashboard', __name__)

@dashboard_bp.route('/customer', methods=['GET'])
@jwt_required()
def customer_dashboard():
    # JWT identity is stored as a string; convert back to int for DB lookup
    try:
        user_id = int(get_jwt_identity())
    except (TypeError, ValueError):
        return jsonify({'message': 'Invalid token identity'}), 422
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

    # Get user's cart items
    cart = user.carts[0] if user.carts else None
    cart_items = []
    cart_total_value = 0.0
    if cart:
        for item in cart.items:
            item_total = item.quantity * item.product.price
            cart_total_value += item_total
            cart_items.append({
                'product_id': item.product_id,
                'product_name': item.product.name,
                'quantity': item.quantity,
                'price': item.product.price,
                'total': item_total,
                'image_url': item.product.image_url
            })

    # Get user's wishlist items
    wishlist = user.wishlists[0] if user.wishlists else None
    wishlist_items = []
    if wishlist:
        for item in wishlist.items:
            wishlist_items.append({
                'product_id': item.product_id,
                'product_name': item.product.name,
                'price': item.product.price,
                'image_url': item.product.image_url,
                'store_name': item.product.store.name if item.product.store else 'Unknown'
            })

    # Calculate total spent
    total_spent_result = db.session.query(func.sum(Order.total_amount)).filter(Order.user_id == user_id).scalar()
    total_spent = float(total_spent_result) if total_spent_result else 0.0

    # Order summary
    total_orders = Order.query.filter_by(user_id=user_id).count()

    # Get ordered product IDs to exclude from recommendations
    ordered_product_ids = db.session.query(OrderItem.product_id).join(Order, OrderItem.order_id == Order.id).filter(Order.user_id == user_id).distinct().all()
    ordered_product_ids = [p.product_id for p in ordered_product_ids]

    # Recommended products: random 4 products not ordered by user
    recommended_products = Product.query.filter(~Product.id.in_(ordered_product_ids)).order_by(func.random()).limit(4).all() if ordered_product_ids else Product.query.order_by(func.random()).limit(4).all()
    recommended_data = [{
        'id': p.id,
        'name': p.name,
        'price': p.price,
        'image_url': p.image_url,
        'store_name': p.store.name if p.store else 'Unknown'
    } for p in recommended_products]

    return jsonify({
        'user': {
            'id': user.id,
            'name': user.name,
            'email': user.email,
            'role': user.role,
            'profile_picture': user.profile_picture,
            'created_at': user.created_at.isoformat()
        },
        'orders': orders_data,
        'cart_items': cart_items,
        'cart_total_value': cart_total_value,
        'wishlist_items': wishlist_items,
        'total_spent': total_spent,
        'total_orders': total_orders,
        'recommended_products': recommended_data
    }), 200

@dashboard_bp.route('/admin', methods=['GET'])
@jwt_required()
def admin_dashboard():
    try:
        user_id = int(get_jwt_identity())
    except (TypeError, ValueError):
        return jsonify({'message': 'Invalid token identity'}), 422
    user = User.query.get(user_id)

    if not user or user.role not in ['manager', 'super_admin']:
        return jsonify({'message': 'Unauthorized'}), 403

    # Filter data by store for managers, global for super_admin
    store_filter = None
    if user.role == 'manager':
        if not user.store:
            return jsonify({'message': 'Manager has no associated store'}), 403
        store_filter = user.store.id

    # Total users (global for super_admin, store-specific for manager)
    total_users = User.query.count() if user.role == 'super_admin' else None

    # Commission analytics for super_admin
    if user.role == 'super_admin':
        # Calculate total commission using product commissions
        total_commission_earned = 0.0
        
        # Get all delivered orders with their items
        orders_with_items = db.session.query(
            OrderItem.product_id,
            OrderItem.quantity,
            OrderItem.price
        ).join(Order, OrderItem.order_id == Order.id)\
         .filter(Order.status == 'delivered').all()
        
        # Calculate commission for each order item using overrides or tier defaults
        for item in orders_with_items:
            commission = Commission.query.filter_by(product_id=item.product_id).first()

            if commission and commission.is_manual:
                if commission.commission_amount is not None:
                    commission_earned = commission.commission_amount * item.quantity
                    total_commission_earned += commission_earned
                    continue
                if commission.commission_percentage is not None:
                    item_total = item.price * item.quantity
                    commission_earned = (item_total * commission.commission_percentage) / 100
                    total_commission_earned += commission_earned
                    continue

            # Fall back to tier rate for non-manual or missing overrides
            applicable_rate = CommissionRate.query.filter(
                CommissionRate.is_active == True,
                CommissionRate.min_price <= item.price,
                db.or_(CommissionRate.max_price.is_(None), CommissionRate.max_price >= item.price)
            ).first()

            if applicable_rate:
                item_total = item.price * item.quantity
                commission_earned = (item_total * applicable_rate.commission_percentage) / 100
                total_commission_earned += commission_earned

    # Total products (global for super_admin, store-specific for manager)
    if user.role == 'super_admin':
        total_products = Product.query.count()
        total_stock_value = db.session.query(func.sum(func.coalesce(Product.cost_price, Product.price) * Product.stock_quantity)).scalar()
        total_stock_value = float(total_stock_value) if total_stock_value else 0.0
        total_revenue = db.session.query(func.sum(Order.total_amount)).filter(Order.status == 'delivered').scalar()
        total_revenue = float(total_revenue) if total_revenue else 0.0
        revenue_today = db.session.query(func.sum(Order.total_amount)).filter(Order.status == 'delivered', func.date(Order.created_at) == func.date(func.now())).scalar()
        revenue_today = float(revenue_today) if revenue_today else 0.0
        
        # Financial metrics for super_admin including commission
        total_units_sold = db.session.query(func.sum(OrderItem.quantity)).join(Order, OrderItem.order_id == Order.id).filter(Order.status == 'delivered').scalar()
        total_units_sold = int(total_units_sold) if total_units_sold else 0
        total_costs = db.session.query(func.sum(func.coalesce(Product.cost_price, Product.price) * OrderItem.quantity)).join(Order, OrderItem.order_id == Order.id).join(Product, OrderItem.product_id == Product.id).filter(Order.status == 'delivered').scalar()
        total_costs = float(total_costs) if total_costs else 0.0
        total_profit = total_revenue - total_costs
        total_commission_revenue = total_commission_earned
        
    else:
        total_products = Product.query.filter_by(store_id=store_filter).count()
        total_stock_value = db.session.query(func.sum(func.coalesce(Product.cost_price, 0) * Product.stock_quantity)).filter(Product.store_id == store_filter).scalar()
        total_stock_value = float(total_stock_value) if total_stock_value else 0.0
        total_revenue = db.session.query(func.sum(Order.total_amount)).filter(Order.store_id == store_filter, Order.status == 'delivered').scalar()
        total_revenue = float(total_revenue) if total_revenue else 0.0
        revenue_today = db.session.query(func.sum(Order.total_amount)).filter(Order.store_id == store_filter, Order.status == 'delivered', func.date(Order.created_at) == func.date(func.now())).scalar()
        revenue_today = float(revenue_today) if revenue_today else 0.0
        # Financial metrics for managers
        total_units_sold = db.session.query(func.sum(OrderItem.quantity)).join(Order, OrderItem.order_id == Order.id).filter(Order.store_id == store_filter, Order.status == 'delivered').scalar()
        total_units_sold = int(total_units_sold) if total_units_sold else 0
        total_costs = db.session.query(func.sum(func.coalesce(Product.cost_price, 0) * OrderItem.quantity)).join(Order, OrderItem.order_id == Order.id).join(Product, OrderItem.product_id == Product.id).filter(Order.store_id == store_filter, Order.status == 'delivered').scalar()
        total_costs = float(total_costs) if total_costs else 0.0
        total_profit = total_revenue - total_costs
        total_commission_revenue = 0.0  # Managers don't earn commission

    # Total orders (global for super_admin, store-specific for manager)
    if user.role == 'super_admin':
        total_orders = Order.query.count()
    else:
        total_orders = Order.query.filter_by(store_id=store_filter).count()

    # Total reviews and average rating (global for super_admin, store-specific for manager)
    if user.role == 'super_admin':
        total_reviews = Review.query.count()
        avg_rating_result = db.session.query(func.avg(Review.rating)).scalar()
        avg_rating = round(float(avg_rating_result), 2) if avg_rating_result else 0.0
    else:
        # For managers, get reviews for their store's products
        store_products = Product.query.filter_by(store_id=store_filter).with_entities(Product.id).all()
        product_ids = [p.id for p in store_products]
        total_reviews = Review.query.filter(Review.product_id.in_(product_ids)).count()
        avg_rating_result = db.session.query(func.avg(Review.rating)).filter(Review.product_id.in_(product_ids)).scalar()
        avg_rating = round(float(avg_rating_result), 2) if avg_rating_result else 0.0

    # Recent orders (global for super_admin, store-specific for manager)
    if user.role == 'super_admin':
        recent_orders = Order.query.order_by(Order.created_at.desc()).limit(10).all()
    else:
        recent_orders = Order.query.filter_by(store_id=store_filter).order_by(Order.created_at.desc()).limit(10).all()
    orders_data = [{
        'id': order.id,
        'user_email': order.user.email,
        'total_amount': order.total_amount,
        'status': order.status,
        'created_at': order.created_at.isoformat()
    } for order in recent_orders]

    # Top rated products (global for super_admin, store-specific for manager)
    if user.role == 'super_admin':
        top_rated_products = db.session.query(
            Product.id, Product.name, func.avg(Review.rating).label('avg_rating'), func.count(Review.id).label('review_count')
        ).join(Review, Product.id == Review.product_id).group_by(Product.id, Product.name).order_by(func.avg(Review.rating).desc()).limit(5).all()
    else:
        store_products = Product.query.filter_by(store_id=store_filter).with_entities(Product.id).all()
        product_ids = [p.id for p in store_products]
        top_rated_products = db.session.query(
            Product.id, Product.name, func.avg(Review.rating).label('avg_rating'), func.count(Review.id).label('review_count')
        ).join(Review, Product.id == Review.product_id).filter(Product.id.in_(product_ids)).group_by(Product.id, Product.name).order_by(func.avg(Review.rating).desc()).limit(5).all()

    # Analytics data (global for super_admin, store-specific for manager)
    if user.role == 'super_admin':
        page_views_today = PageView.query.filter(func.date(PageView.viewed_at) == func.date(func.now())).count()
        button_clicks_today = ButtonClick.query.filter(func.date(ButtonClick.clicked_at) == func.date(func.now())).count()
    else:
        # For managers, analytics are store-specific (simplified for now)
        page_views_today = 0  # Placeholder
        button_clicks_today = 0  # Placeholder

    # Get cart items and total value for all users (global for super_admin, store-specific for manager)
    if user.role == 'super_admin':
        carts = Cart.query.all()
        product_ids = None  # No filtering needed
    else:
        # For managers, get carts for their store's products
        store_products = Product.query.filter_by(store_id=store_filter).with_entities(Product.id).all()
        product_ids = [p.id for p in store_products]
        carts = Cart.query.join(CartItem).filter(CartItem.product_id.in_(product_ids)).distinct().all()

    cart_items_data = []
    total_cart_value = 0.0
    total_cart_items = 0
    for cart in carts:
        cart_total = 0.0
        items_data = []
        for item in cart.items:
            # For managers, only include items from their store
            if product_ids and item.product_id not in product_ids:
                continue
            item_total = item.quantity * item.product.price
            cart_total += item_total
            total_cart_items += item.quantity
            items_data.append({
                'product_id': item.product_id,
                'product_name': item.product.name,
                'quantity': item.quantity,
                'price': item.product.price,
                'total': item_total
            })
        total_cart_value += cart_total
        cart_items_data.append({
            'user_id': cart.user_id,
            'user_email': cart.user.email,
            'items': items_data,
            'cart_total': cart_total
        })

    # Get wishlist items count (global for super_admin, store-specific for manager)
    if user.role == 'super_admin':
        total_wishlist_items = db.session.query(func.count(WishlistItem.id)).scalar()
        total_wishlist_items = int(total_wishlist_items) if total_wishlist_items else 0
    else:
        # For managers, get wishlist items for their store's products
        store_products = Product.query.filter_by(store_id=store_filter).with_entities(Product.id).all()
        product_ids = [p.id for p in store_products]
        total_wishlist_items = db.session.query(func.count(WishlistItem.id)).filter(WishlistItem.product_id.in_(product_ids)).scalar()
        total_wishlist_items = int(total_wishlist_items) if total_wishlist_items else 0

    analytics = {
        'total_products': total_products,
        'total_orders': total_orders,
        'total_reviews': total_reviews,
        'average_rating': avg_rating,
        'top_rated_products': [{'product_id': p.id, 'product_name': p.name, 'avg_rating': round(float(p.avg_rating), 2), 'review_count': p.review_count} for p in top_rated_products],
        'page_views_today': page_views_today,
        'button_clicks_today': button_clicks_today,
        'total_stock_value': total_stock_value,
        'total_revenue': total_revenue,
        'revenue_today': revenue_today,
        'cart_items': cart_items_data,
        'total_cart_value': total_cart_value,
        'total_cart_items': total_cart_items,
        'total_wishlist_items': total_wishlist_items,
        'total_units_sold': total_units_sold,
        'total_costs': total_costs,
        'total_profit': total_profit,
        'total_commission_revenue': total_commission_revenue
    }
    if user.role == 'manager':
        # Managers don't have commission data
        analytics.update({
            'total_commission_revenue': 0.0
        })
    if user.role == 'super_admin':
        analytics['total_users'] = total_users

    return jsonify({
        'analytics': analytics,
        'recent_orders': orders_data
    }), 200

@dashboard_bp.route('/commissions', methods=['GET'])
@jwt_required()
def get_commission_analytics():
    """Get detailed commission analytics for super admin"""
    try:
        user_id = int(get_jwt_identity())
    except (TypeError, ValueError):
        return jsonify({'message': 'Invalid token identity'}), 422
    user = User.query.get(user_id)

    if not user or user.role != 'super_admin':
        return jsonify({'message': 'Unauthorized'}), 403

    # Get commission data using tiered commission rates
    commission_data = db.session.query(
        Store.name.label('store_name'),
        Product.name.label('product_name'),
        Product.price.label('product_price'),
        func.sum(Order.total_amount).label('total_revenue'),
        func.sum(OrderItem.quantity).label('total_units_sold'),
        func.count(Order.id).label('total_orders')
    ).select_from(Product)\
     .join(Store, Product.store_id == Store.id)\
     .outerjoin(OrderItem, Product.id == OrderItem.product_id)\
     .outerjoin(Order, OrderItem.order_id == Order.id)\
     .filter(Order.status == 'delivered')\
     .group_by(Store.name, Product.name, Product.price)\
     .all()

    # Calculate commission earnings using tiered rates
    commission_summary = []
    total_commission_earned = 0.0
    
    for row in commission_data:
        # Find applicable commission rate for this product
        applicable_rate = CommissionRate.query.filter(
            CommissionRate.is_active == True,
            CommissionRate.min_price <= row.product_price,
            db.or_(CommissionRate.max_price.is_(None), CommissionRate.max_price >= row.product_price)
        ).first()
        
        if applicable_rate and row.total_revenue:
            commission_earned = (row.total_revenue * applicable_rate.commission_percentage) / 100
            total_commission_earned += commission_earned
        else:
            commission_earned = 0.0
            
        commission_summary.append({
            'store_name': row.store_name,
            'product_name': row.product_name,
            'product_price': float(row.product_price or 0),
            'commission_rate': applicable_rate.commission_percentage if applicable_rate else 0,
            'commission_type': 'tiered_rate',
            'total_revenue': float(row.total_revenue or 0),
            'total_units_sold': int(row.total_units_sold or 0),
            'total_orders': int(row.total_orders or 0),
            'commission_earned': round(commission_earned, 2)
        })

    # Get store-wise commission breakdown
    store_commission_data = db.session.query(
        Store.name.label('store_name'),
        func.count(func.distinct(Product.id)).label('total_products'),
        func.sum(Order.total_amount).label('total_revenue'),
        func.sum(OrderItem.quantity).label('total_units_sold')
    ).select_from(Store)\
     .join(Product, Store.id == Product.store_id)\
     .outerjoin(Commission, Product.id == Commission.product_id)\
     .outerjoin(OrderItem, Product.id == OrderItem.product_id)\
     .outerjoin(Order, OrderItem.order_id == Order.id)\
     .filter(Order.status == 'delivered')\
     .group_by(Store.name)\
     .all()

    store_breakdown = []
    for row in store_commission_data:
        store_breakdown.append({
            'store_name': row.store_name,
            'total_products': int(row.total_products or 0),
            'total_revenue': float(row.total_revenue or 0),
            'total_units_sold': int(row.total_units_sold or 0)
        })

    return jsonify({
        'commission_summary': commission_summary,
        'store_breakdown': store_breakdown,
        'total_commission_earned': round(total_commission_earned, 2)
    }), 200

@dashboard_bp.route('/commission-trends', methods=['GET'])
@jwt_required()
def get_commission_trends():
    """Get commission earnings trends over time"""
    try:
        user_id = int(get_jwt_identity())
    except (TypeError, ValueError):
        return jsonify({'message': 'Invalid token identity'}), 422
    user = User.query.get(user_id)

    if not user or user.role != 'super_admin':
        return jsonify({'message': 'Unauthorized'}), 403

    days = request.args.get('days', 30, type=int)
    start_date = datetime.utcnow() - timedelta(days=days)

    # Get daily commission trends using tiered rates
    daily_commission_query = db.session.query(
        func.date(Order.created_at).label('date'),
        OrderItem.product_id,
        OrderItem.quantity,
        OrderItem.price,
        Product.price.label('product_price')
    ).select_from(Order)\
     .join(OrderItem, Order.id == OrderItem.order_id)\
     .join(Product, OrderItem.product_id == Product.id)\
     .filter(Order.status == 'delivered')\
     .filter(Order.created_at >= start_date)\
     .order_by('date')

    results = daily_commission_query.all()

    # Process and aggregate the data using tiered commission rates
    date_commission_map = {}
    
    for row in results:
        date = row.date
        
        # Find applicable commission rate for this product
        applicable_rate = CommissionRate.query.filter(
            CommissionRate.is_active == True,
            CommissionRate.min_price <= row.product_price,
            db.or_(CommissionRate.max_price.is_(None), CommissionRate.max_price >= row.product_price)
        ).first()
        
        if applicable_rate:
            # Calculate commission based on the order item total
            item_total = row.price * row.quantity
            commission = (item_total * applicable_rate.commission_percentage) / 100
        else:
            commission = 0.0
            
        if date in date_commission_map:
            date_commission_map[date] += commission
        else:
            date_commission_map[date] = commission

    # Fill in missing dates with zero values and format data
    commission_trends = []
    current_date = start_date.date()
    end_date = datetime.utcnow().date()

    while current_date <= end_date:
        commission = date_commission_map.get(current_date, 0.0)
        commission_trends.append({
            'date': current_date.isoformat(),
            'commission_earned': round(commission, 2)
        })
        current_date += timedelta(days=1)

    return jsonify({
        'commission_trends': commission_trends
    }), 200

@dashboard_bp.route('/users', methods=['GET'])
@jwt_required()
def get_users():
    try:
        user_id = int(get_jwt_identity())
    except (TypeError, ValueError):
        return jsonify({'message': 'Invalid token identity'}), 422
    user = User.query.get(user_id)

    if not user or user.role != 'super_admin':
        return jsonify({'message': 'Unauthorized'}), 403

    # Get pagination parameters
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 10, type=int)
    
    # Ensure reasonable pagination limits
    per_page = min(max(per_page, 1), 100)  # Max 100 items per page

    # Get total count for pagination
    total_count = User.query.count()

    # Get paginated users
    users = User.query.paginate(
        page=page,
        per_page=per_page,
        error_out=False
    )

    users_data = [{
        'id': u.id,
        'name': u.name,
        'email': u.email,
        'role': u.role,
        'created_at': u.created_at.isoformat(),
        'store': {
            'id': u.store.id,
            'name': u.store.name,
            'address': u.store.address,
            'contact_number': u.store.contact_number
        } if u.store else None
    } for u in users.items]

    # Return paginated response with metadata
    return jsonify({
        'users': users_data,
        'pagination': {
            'page': page,
            'per_page': per_page,
            'total': total_count,
            'pages': (total_count + per_page - 1) // per_page,
            'has_next': users.has_next,
            'has_prev': users.has_prev
        }
    }), 200


@dashboard_bp.route('/users', methods=['POST'])
@jwt_required()
def create_user():
    # Only super_admin can create other users (especially manager/super_admin roles)
    try:
        current_user_id = int(get_jwt_identity())
    except (TypeError, ValueError):
        return jsonify({'message': 'Invalid token identity'}), 422

    current_user = User.query.get(current_user_id)
    if not current_user or current_user.role != 'super_admin':
        return jsonify({'message': 'Unauthorized'}), 403

    data = request.get_json() or {}
    email = data.get('email')
    password = data.get('password')
    name = data.get('name')
    role = data.get('role', 'customer')

    if not email or not password:
        return jsonify({'message': 'Email and password are required'}), 400

    if User.query.filter_by(email=email).first():
        return jsonify({'message': 'User already exists'}), 400

    if role not in ['customer', 'manager', 'super_admin']:
        return jsonify({'message': 'Invalid role'}), 400

    hashed = generate_password_hash(password)
    new_user = User(email=email, password_hash=hashed, name=name, role=role)
    db.session.add(new_user)

    # If creating a manager, also create their store
    if role == 'manager':
        store_name = data.get('store_name')
        store_address = data.get('store_address')
        store_logo_url = data.get('store_logo_url')
        store_contact_number = data.get('store_contact_number')
        store_description = data.get('store_description')

        if not store_name:
            db.session.rollback()
            return jsonify({'message': 'Store name is required for managers'}), 400

        # Commit user first to get the ID
        db.session.commit()

        from models import Store
        new_store = Store(
            name=store_name,
            address=store_address,
            logo_url=store_logo_url,
            contact_number=store_contact_number,
            description=store_description,
            manager_id=new_user.id
        )
        db.session.add(new_store)
        db.session.commit()
    else:
        db.session.commit()

    return jsonify({'message': 'User created successfully', 'user': {'id': new_user.id, 'email': new_user.email, 'name': new_user.name, 'role': new_user.role}}), 201


@dashboard_bp.route('/users/<int:user_id>', methods=['PUT'])
@jwt_required()
def update_user(user_id):
    try:
        current_user_id = int(get_jwt_identity())
    except (TypeError, ValueError):
        return jsonify({'message': 'Invalid token identity'}), 422

    current_user = User.query.get(current_user_id)
    if not current_user or current_user.role != 'super_admin':
        return jsonify({'message': 'Unauthorized'}), 403

    user = User.query.get(user_id)
    if not user:
        return jsonify({'message': 'User not found'}), 404

    data = request.get_json() or {}
    name = data.get('name')
    email = data.get('email')
    password = data.get('password')
    profile_picture = data.get('profile_picture')

    if email and email != user.email:
        if User.query.filter_by(email=email).first():
            return jsonify({'message': 'Email already in use'}), 400
        user.email = email

    if name is not None:
        user.name = name

    if password:
        user.password_hash = generate_password_hash(password)

    if profile_picture is not None:
        user.profile_picture = profile_picture

    db.session.commit()
    return jsonify({'message': 'User updated successfully', 'user': {'id': user.id, 'email': user.email, 'name': user.name, 'role': user.role, 'profile_picture': user.profile_picture}}), 200


@dashboard_bp.route('/users/<int:user_id>', methods=['DELETE'])
@jwt_required()
def delete_user(user_id):
    # Only super_admin can delete users
    try:
        current_user_id = int(get_jwt_identity())
    except (TypeError, ValueError):
        return jsonify({'message': 'Invalid token identity'}), 422

    current_user = User.query.get(current_user_id)
    if not current_user or current_user.role != 'super_admin':
        return jsonify({'message': 'Unauthorized'}), 403

    if current_user_id == user_id:
        return jsonify({'message': 'Cannot delete your own account'}), 400

    user = User.query.get(user_id)
    if not user:
        return jsonify({'message': 'User not found'}), 404

    db.session.delete(user)
    db.session.commit()
    return jsonify({'message': 'User deleted successfully'}), 200

@dashboard_bp.route('/users/<int:user_id>/role', methods=['PUT'])
@jwt_required()
def update_user_role(user_id):
    try:
        current_user_id = int(get_jwt_identity())
    except (TypeError, ValueError):
        return jsonify({'message': 'Invalid token identity'}), 422
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

@dashboard_bp.route('/store', methods=['POST'])
@jwt_required()
def create_store():
    try:
        user_id = int(get_jwt_identity())
    except (TypeError, ValueError):
        return jsonify({'message': 'Invalid token identity'}), 422
    user = User.query.get(user_id)

    if not user or user.role != 'manager':
        return jsonify({'message': 'Unauthorized'}), 403

    # If user already has a store, return 400
    if user.store:
        return jsonify({'message': 'Store already exists. Use PUT to update.'}), 400

    # Handle FormData for file uploads
    if request.content_type and 'multipart/form-data' in request.content_type:
        name = request.form.get('name')
        address = request.form.get('address')
        contact_number = request.form.get('contact_number')
        description = request.form.get('description')

        logo_url = None
        logo_file = request.files.get('logo')
        if logo_file and logo_file.filename:
            server_dir = os.path.dirname(os.path.abspath(__file__))
            project_root = os.path.dirname(os.path.dirname(server_dir))
            uploads_dir = os.path.join(project_root, 'uploads')
            os.makedirs(uploads_dir, exist_ok=True)

            timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
            filename = secure_filename(f"{timestamp}_{logo_file.filename}")
            filepath = os.path.join(uploads_dir, filename)
            logo_file.save(filepath)
            logo_url = f"/uploads/{filename}"
    else:
        data = request.get_json() or {}
        name = data.get('name')
        address = data.get('address')
        contact_number = data.get('contact_number')
        description = data.get('description')
        logo_url = data.get('logo_url')

    if not name:
        return jsonify({'message': 'Store name is required'}), 400

    new_store = Store(
        name=name,
        address=address or "",
        contact_number=contact_number or "",
        description=description or "",
        logo_url=logo_url,
        manager_id=user_id
    )
    db.session.add(new_store)
    db.session.commit()

    return jsonify({
        'message': 'Store created successfully',
        'store': {
            'id': new_store.id,
            'name': new_store.name,
            'address': new_store.address,
            'logo_url': new_store.logo_url,
            'contact_number': new_store.contact_number,
            'description': new_store.description,
        }
    }), 201


@dashboard_bp.route('/store', methods=['GET'])
@jwt_required()
def get_store():
    try:
        user_id = int(get_jwt_identity())
    except (TypeError, ValueError):
        return jsonify({'message': 'Invalid token identity'}), 422
    user = User.query.get(user_id)

    if not user or user.role != 'manager':
        return jsonify({'message': 'Unauthorized'}), 403

    if not user.store:
        return jsonify({'message': 'Store not found'}), 404

    store = user.store
    return jsonify({
        'store': {
            'id': store.id,
            'name': store.name,
            'address': store.address,
            'logo_url': store.logo_url,
            'contact_number': store.contact_number,
            'description': store.description,
            'created_at': store.created_at.isoformat(),
            'updated_at': store.updated_at.isoformat()
        }
    }), 200

@dashboard_bp.route('/store', methods=['PUT'])
@jwt_required()
def update_store():
    try:
        user_id = int(get_jwt_identity())
    except (TypeError, ValueError):
        return jsonify({'message': 'Invalid token identity'}), 422
    user = User.query.get(user_id)

    if not user or user.role != 'manager':
        return jsonify({'message': 'Unauthorized'}), 403

    # If no store exists, create one now
    if not user.store:
        name = request.form.get('name') if request.content_type and 'multipart/form-data' in request.content_type else (request.get_json() or {}).get('name')
        if not name:
            return jsonify({'message': 'Store name is required to create store'}), 400
        
        new_store = Store(
            name=name,
            address=request.form.get('address') if request.content_type and 'multipart/form-data' in request.content_type else (request.get_json() or {}).get('address', ''),
            contact_number=request.form.get('contact_number') if request.content_type and 'multipart/form-data' in request.content_type else (request.get_json() or {}).get('contact_number', ''),
            description=request.form.get('description') if request.content_type and 'multipart/form-data' in request.content_type else (request.get_json() or {}).get('description', ''),
            manager_id=user_id
        )
        db.session.add(new_store)
        db.session.commit()
        return jsonify({
            'message': 'Store created successfully',
            'store': {
                'id': new_store.id,
                'name': new_store.name,
                'address': new_store.address,
                'logo_url': new_store.logo_url,
                'contact_number': new_store.contact_number,
                'description': new_store.description,
            }
        }), 201

    store = user.store

    # Handle FormData for file uploads
    if request.content_type and 'multipart/form-data' in request.content_type:
        name = request.form.get('name')
        address = request.form.get('address')
        contact_number = request.form.get('contact_number')
        description = request.form.get('description')

        # Handle logo file upload
        logo_file = request.files.get('logo')
        if logo_file and logo_file.filename:
            # Ensure uploads directory exists in project root
            server_dir = os.path.dirname(os.path.abspath(__file__))
            project_root = os.path.dirname(os.path.dirname(server_dir))
            uploads_dir = os.path.join(project_root, 'uploads')
            os.makedirs(uploads_dir, exist_ok=True)

            # Create unique filename with timestamp
            timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
            filename = secure_filename(f"{timestamp}_{logo_file.filename}")
            filepath = os.path.join(uploads_dir, filename)
            logo_file.save(filepath)

            # Store relative path in database
            store.logo_url = f"/uploads/{filename}"

        if name is not None:
            store.name = name
        if address is not None:
            store.address = address
        if contact_number is not None:
            store.contact_number = contact_number
        if description is not None:
            store.description = description
    else:
        # Handle JSON data (backward compatibility)
        data = request.get_json() or {}
        if 'name' in data:
            store.name = data['name']
        if 'address' in data:
            store.address = data['address']
        if 'logo_url' in data:
            store.logo_url = data['logo_url']
        if 'contact_number' in data:
            store.contact_number = data['contact_number']
        if 'description' in data:
            store.description = data['description']

    db.session.commit()

    return jsonify({'message': 'Store updated successfully'}), 200


@dashboard_bp.route('/reviews/all', methods=['GET'])
@jwt_required()
def get_all_reviews():
    try:
        user_id = int(get_jwt_identity())
    except (TypeError, ValueError):
        return jsonify({'message': 'Invalid token identity'}), 422
    user = User.query.get(user_id)

    if not user or user.role not in ['manager', 'super_admin']:
        return jsonify({'message': 'Unauthorized'}), 403

    # Get all reviews with product and store info
    reviews_query = Review.query.join(Product, Review.product_id == Product.id).add_columns(
        Product.name.label('product_name'),
        Product.store_id.label('store_id')
    ).order_by(Review.created_at.desc()).all()

    reviews_list = []
    for review, product_name, store_id in reviews_query:
        store = Store.query.get(store_id) if store_id else None
        reviews_list.append({
            'id': review.id,
            'product_id': review.product_id,
            'product_name': product_name,
            'store_name': store.name if store else 'Unknown Store',
            'user_id': review.user_id,
            'user_name': review.user_name,
            'rating': review.rating,
            'comment': review.comment,
            'created_at': review.created_at.isoformat()
        })

    return jsonify({'reviews': reviews_list}), 200


@dashboard_bp.route('/reviews/<int:review_id>', methods=['DELETE'])
@jwt_required()
def delete_review(review_id):
    try:
        user_id = int(get_jwt_identity())
    except (TypeError, ValueError):
        return jsonify({'message': 'Invalid token identity'}), 422
    user = User.query.get(user_id)

    if not user or user.role not in ['manager', 'super_admin']:
        return jsonify({'message': 'Unauthorized'}), 403

    review = Review.query.get(review_id)
    if not review:
        return jsonify({'message': 'Review not found'}), 404

    # For managers, check if the review belongs to their store's products
    if user.role == 'manager':
        product = Product.query.get(review.product_id)
        if not product or product.store_id != user.store.id:
            return jsonify({'message': 'Unauthorized to delete this review'}), 403

    db.session.delete(review)
    db.session.commit()

    return jsonify({'message': 'Review deleted successfully'}), 200

@dashboard_bp.route('/reviews/<int:review_id>/reply', methods=['POST'])
@jwt_required()
def reply_review(review_id):
    try:
        user_id = int(get_jwt_identity())
    except (TypeError, ValueError):
        return jsonify({'message': 'Invalid token identity'}), 422
    user = User.query.get(user_id)

    if not user or user.role not in ['manager', 'super_admin']:
        return jsonify({'message': 'Unauthorized'}), 403

    review = Review.query.get(review_id)
    if not review:
        return jsonify({'message': 'Review not found'}), 404

    if user.role == 'manager':
        product = Product.query.get(review.product_id)
        if not product or product.store_id != user.store.id:
            return jsonify({'message': 'Unauthorized to reply to this review'}), 403

    data = request.get_json() or {}
    reply_text = data.get('reply', '').strip()

    if not reply_text:
        return jsonify({'message': 'Reply text is required'}), 400

    review.reply = reply_text
    review.replied_at = datetime.utcnow()
    db.session.commit()

    return jsonify({'message': 'Reply added successfully', 'review': {
        'id': review.id,
        'reply': review.reply,
        'replied_at': review.replied_at.isoformat()
    }}), 200

@dashboard_bp.route('/comments/<int:comment_id>/reply', methods=['POST'])
@jwt_required()
def reply_comment(comment_id):
    try:
        user_id = int(get_jwt_identity())
    except (TypeError, ValueError):
        return jsonify({'message': 'Invalid token identity'}), 422
    user = User.query.get(user_id)

    if not user or user.role not in ['manager', 'super_admin']:
        return jsonify({'message': 'Unauthorized'}), 403

    comment = Comment.query.get(comment_id)
    if not comment:
        return jsonify({'message': 'Comment not found'}), 404

    if user.role == 'manager':
        product = Product.query.get(comment.product_id)
        if not product or product.store_id != user.store.id:
            return jsonify({'message': 'Unauthorized to reply to this comment'}), 403

    data = request.get_json() or {}
    reply_text = data.get('reply', '').strip()

    if not reply_text:
        return jsonify({'message': 'Reply text is required'}), 400

    comment.reply = reply_text
    comment.replied_at = datetime.utcnow()
    db.session.commit()

    return jsonify({'message': 'Reply added successfully', 'comment': {
        'id': comment.id,
        'reply': comment.reply,
        'replied_at': comment.replied_at.isoformat()
    }}), 200

# Profile routes
@dashboard_bp.route('/profile', methods=['GET'])
@jwt_required()
def get_profile():
    try:
        user_id = int(get_jwt_identity())
    except (TypeError, ValueError):
        return jsonify({'message': 'Invalid token identity'}), 422
    user = User.query.get(user_id)

    if not user:
        return jsonify({'message': 'User not found'}), 404

    addresses = Address.query.filter_by(user_id=user_id).all()
    addresses_data = [{
        'id': addr.id,
        'name': addr.name,
        'street_address': addr.street_address,
        'city': addr.city,
        'state': addr.state,
        'postal_code': addr.postal_code,
        'country': addr.country,
        'is_default': addr.is_default
    } for addr in addresses]

    payments = PaymentMethod.query.filter_by(user_id=user_id).all()
    payments_data = [{
        'id': pm.id,
        'cardholder_name': pm.cardholder_name,
        'card_number_last_four': pm.card_number_last_four,
        'card_type': pm.card_type,
        'expiry_month': pm.expiry_month,
        'expiry_year': pm.expiry_year,
        'is_default': pm.is_default
    } for pm in payments]

    return jsonify({
        'user': {
            'id': user.id,
            'name': user.name,
            'email': user.email,
            'profile_picture': user.profile_picture,
            'role': user.role,
            'created_at': user.created_at.isoformat()
        },
        'addresses': addresses_data,
        'payment_methods': payments_data
    }), 200

@dashboard_bp.route('/profile', methods=['PUT'])
@jwt_required()
def update_profile():
    try:
        user_id = int(get_jwt_identity())
    except (TypeError, ValueError):
        return jsonify({'message': 'Invalid token identity'}), 422
    user = User.query.get(user_id)

    if not user:
        return jsonify({'message': 'User not found'}), 404

    # Handle FormData for file uploads
    if request.content_type and 'multipart/form-data' in request.content_type:
        name = request.form.get('name')
        email = request.form.get('email')

        # Handle profile picture upload
        profile_file = request.files.get('profile_picture')
        if profile_file and profile_file.filename:
            # Ensure uploads directory exists in project root
            # Get project root by going up two levels from this file's location
            server_dir = os.path.dirname(os.path.abspath(__file__))
            project_root = os.path.dirname(os.path.dirname(server_dir))
            uploads_dir = os.path.join(project_root, 'uploads')
            os.makedirs(uploads_dir, exist_ok=True)

            # Create unique filename with timestamp
            timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
            filename = secure_filename(f"{timestamp}_{profile_file.filename}")
            filepath = os.path.join(uploads_dir, filename)
            profile_file.save(filepath)

            # Store relative path in database
            user.profile_picture = f"/uploads/{filename}"

        if name is not None:
            user.name = name
        if email is not None and email != user.email:
            if User.query.filter_by(email=email).first():
                return jsonify({'message': 'Email already in use'}), 400
            user.email = email
    else:
        # Handle JSON data
        data = request.get_json() or {}
        if 'name' in data:
            user.name = data['name']
        if 'email' in data and data['email'] != user.email:
            if User.query.filter_by(email=data['email']).first():
                return jsonify({'message': 'Email already in use'}), 400
            user.email = data['email']

    db.session.commit()
    return jsonify({
        'message': 'Profile updated successfully',
        'user': {
            'id': user.id,
            'name': user.name,
            'email': user.email,
            'profile_picture': user.profile_picture,
            'role': user.role,
            'created_at': user.created_at.isoformat()
        }
    }), 200

@dashboard_bp.route('/profile/addresses', methods=['POST'])
@jwt_required()
def add_address():
    try:
        user_id = int(get_jwt_identity())
    except (TypeError, ValueError):
        return jsonify({'message': 'Invalid token identity'}), 422

    data = request.get_json() or {}
    name = data.get('name')
    street_address = data.get('street_address')
    city = data.get('city')
    state = data.get('state')
    postal_code = data.get('postal_code')
    country = data.get('country')
    is_default = data.get('is_default', False)

    if not all([name, street_address, city, state, postal_code, country]):
        return jsonify({'message': 'All address fields are required'}), 400

    # If setting as default, unset other defaults
    if is_default:
        Address.query.filter_by(user_id=user_id, is_default=True).update({'is_default': False})

    new_address = Address(
        user_id=user_id,
        name=name,
        street_address=street_address,
        city=city,
        state=state,
        postal_code=postal_code,
        country=country,
        is_default=is_default
    )
    db.session.add(new_address)
    db.session.commit()

    return jsonify({'message': 'Address added successfully', 'address_id': new_address.id}), 201

@dashboard_bp.route('/profile/addresses/<int:address_id>', methods=['PUT'])
@jwt_required()
def update_address(address_id):
    try:
        user_id = int(get_jwt_identity())
    except (TypeError, ValueError):
        return jsonify({'message': 'Invalid token identity'}), 422

    address = Address.query.filter_by(id=address_id, user_id=user_id).first()
    if not address:
        return jsonify({'message': 'Address not found'}), 404

    data = request.get_json() or {}
    name = data.get('name')
    street_address = data.get('street_address')
    city = data.get('city')
    state = data.get('state')
    postal_code = data.get('postal_code')
    country = data.get('country')
    is_default = data.get('is_default', False)

    if name is not None:
        address.name = name
    if street_address is not None:
        address.street_address = street_address
    if city is not None:
        address.city = city
    if state is not None:
        address.state = state
    if postal_code is not None:
        address.postal_code = postal_code
    if country is not None:
        address.country = country
    if is_default is not None:
        if is_default:
            Address.query.filter_by(user_id=user_id, is_default=True).update({'is_default': False})
        address.is_default = is_default

    db.session.commit()
    return jsonify({'message': 'Address updated successfully'}), 200

@dashboard_bp.route('/profile/addresses/<int:address_id>', methods=['DELETE'])
@jwt_required()
def delete_address(address_id):
    try:
        user_id = int(get_jwt_identity())
    except (TypeError, ValueError):
        return jsonify({'message': 'Invalid token identity'}), 422

    address = Address.query.filter_by(id=address_id, user_id=user_id).first()
    if not address:
        return jsonify({'message': 'Address not found'}), 404

    db.session.delete(address)
    db.session.commit()
    return jsonify({'message': 'Address deleted successfully'}), 200

@dashboard_bp.route('/profile/payments', methods=['POST'])
@jwt_required()
def add_payment_method():
    try:
        user_id = int(get_jwt_identity())
    except (TypeError, ValueError):
        return jsonify({'message': 'Invalid token identity'}), 422

    data = request.get_json() or {}
    cardholder_name = data.get('cardholder_name')
    card_number = data.get('card_number')  # Full card number for processing
    card_type = data.get('card_type')
    expiry_month = data.get('expiry_month')
    expiry_year = data.get('expiry_year')
    is_default = data.get('is_default', False)

    if not all([cardholder_name, card_number, card_type, expiry_month, expiry_year]):
        return jsonify({'message': 'All payment fields are required'}), 400

    # Basic validation
    if len(card_number) < 13 or len(card_number) > 19:
        return jsonify({'message': 'Invalid card number'}), 400

    card_number_last_four = card_number[-4:]

    # If setting as default, unset other defaults
    if is_default:
        PaymentMethod.query.filter_by(user_id=user_id, is_default=True).update({'is_default': False})

    new_payment = PaymentMethod(
        user_id=user_id,
        cardholder_name=cardholder_name,
        card_number_last_four=card_number_last_four,
        card_type=card_type,
        expiry_month=expiry_month,
        expiry_year=expiry_year,
        is_default=is_default
    )
    db.session.add(new_payment)
    db.session.commit()

    return jsonify({'message': 'Payment method added successfully', 'payment_id': new_payment.id}), 201

@dashboard_bp.route('/profile/payments/<int:payment_id>', methods=['PUT'])
@jwt_required()
def update_payment_method(payment_id):
    try:
        user_id = int(get_jwt_identity())
    except (TypeError, ValueError):
        return jsonify({'message': 'Invalid token identity'}), 422

    payment = PaymentMethod.query.filter_by(id=payment_id, user_id=user_id).first()
    if not payment:
        return jsonify({'message': 'Payment method not found'}), 404

    data = request.get_json() or {}
    cardholder_name = data.get('cardholder_name')
    card_number = data.get('card_number')  # Full card number for processing
    card_type = data.get('card_type')
    expiry_month = data.get('expiry_month')
    expiry_year = data.get('expiry_year')
    is_default = data.get('is_default', False)

    if card_number and (len(card_number) < 13 or len(card_number) > 19):
        return jsonify({'message': 'Invalid card number'}), 400

    if cardholder_name is not None:
        payment.cardholder_name = cardholder_name
    if card_number is not None:
        payment.card_number_last_four = card_number[-4:]
    if card_type is not None:
        payment.card_type = card_type
    if expiry_month is not None:
        payment.expiry_month = expiry_month
    if expiry_year is not None:
        payment.expiry_year = expiry_year
    if is_default is not None:
        if is_default:
            PaymentMethod.query.filter_by(user_id=user_id, is_default=True).update({'is_default': False})
        payment.is_default = is_default

    db.session.commit()
    return jsonify({'message': 'Payment method updated successfully'}), 200

@dashboard_bp.route('/profile/payments/<int:payment_id>', methods=['DELETE'])
@jwt_required()
def delete_payment_method(payment_id):
    try:
        user_id = int(get_jwt_identity())
    except (TypeError, ValueError):
        return jsonify({'message': 'Invalid token identity'}), 422

    payment = PaymentMethod.query.filter_by(id=payment_id, user_id=user_id).first()
    if not payment:
        return jsonify({'message': 'Payment method not found'}), 404

    db.session.delete(payment)
    db.session.commit()
    return jsonify({'message': 'Payment method deleted successfully'}), 200
