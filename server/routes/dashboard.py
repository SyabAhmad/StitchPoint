from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from werkzeug.security import generate_password_hash
from werkzeug.utils import secure_filename
from models import db, User, Order, Product, PageView, ButtonClick, Review, Store, OrderItem
from sqlalchemy import func
import os
from datetime import datetime

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

    # Get user's cart items count
    cart = user.carts[0] if user.carts else None
    cart_count = sum(item.quantity for item in cart.items) if cart else 0

    # Get user's wishlist items count
    wishlist = user.wishlists[0] if user.wishlists else None
    wishlist_count = len(wishlist.items) if wishlist else 0

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
            'created_at': user.created_at.isoformat()
        },
        'orders': orders_data,
        'cart_count': cart_count,
        'wishlist_count': wishlist_count,
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

    # Total products (global for super_admin, store-specific for manager)
    if user.role == 'super_admin':
        total_products = Product.query.count()
    else:
        total_products = Product.query.filter_by(store_id=store_filter).count()

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

    analytics = {
        'total_products': total_products,
        'total_orders': total_orders,
        'total_reviews': total_reviews,
        'average_rating': avg_rating,
        'top_rated_products': [{'product_id': p.id, 'product_name': p.name, 'avg_rating': round(float(p.avg_rating), 2), 'review_count': p.review_count} for p in top_rated_products],
        'page_views_today': page_views_today,
        'button_clicks_today': button_clicks_today
    }
    if user.role == 'super_admin':
        analytics['total_users'] = total_users

    return jsonify({
        'analytics': analytics,
        'recent_orders': orders_data
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

    users = User.query.filter(User.role == 'manager').all()
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
    } for u in users]

    return jsonify({'users': users_data}), 200


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
    # Only super_admin can update arbitrary users via dashboard
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

    if email and email != user.email:
        if User.query.filter_by(email=email).first():
            return jsonify({'message': 'Email already in use'}), 400
        user.email = email

    if name is not None:
        user.name = name

    if password:
        user.password_hash = generate_password_hash(password)

    db.session.commit()
    return jsonify({'message': 'User updated successfully', 'user': {'id': user.id, 'email': user.email, 'name': user.name, 'role': user.role}}), 200


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

    if not user.store:
        return jsonify({'message': 'Store not found'}), 404

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
            # Ensure uploads directory exists
            uploads_dir = os.path.join(os.getcwd(), 'uploads')
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
