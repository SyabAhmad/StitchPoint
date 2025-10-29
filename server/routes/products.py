from flask import Blueprint, jsonify, request
from werkzeug.utils import secure_filename
import os
import time
from flask_jwt_extended import jwt_required, get_jwt_identity, verify_jwt_in_request
from models import db, Product, User, Category, Store, Review, OrderItem

products_bp = Blueprint('products', __name__)

@products_bp.route('/products', methods=['GET'])
def get_products():
    # Get query parameters for filtering
    search = request.args.get('search', '')
    category = request.args.get('category', '')
    min_price = request.args.get('min_price', type=float, default=0)
    max_price = request.args.get('max_price', type=float, default=float('inf'))

    # Build query
    query = Product.query

    if search:
        query = query.filter(
            (Product.name.ilike(f'%{search}%')) |
            (Product.description.ilike(f'%{search}%'))
        )

    if category:
        query = query.filter(Product.category == category)

    query = query.filter(Product.price >= min_price, Product.price <= max_price)

    products = query.all()
    product_list = []
    for product in products:
        category_obj = Category.query.filter_by(name=product.category).first() if product.category else None
        product_list.append({
            'id': product.id,
            'name': product.name,
            'description': product.description,
            'price': product.price,
            'stock_quantity': product.stock_quantity,
            'image_url': product.image_url,
            'category': product.category,
            'category_id': category_obj.id if category_obj else None,
            'store_name': product.store.name if product.store else 'Unknown Store',
            'created_at': product.created_at.isoformat(),
            'updated_at': product.updated_at.isoformat()
        })
    return jsonify({'products': product_list}), 200

@products_bp.route('/products', methods=['POST'])
@jwt_required()
def create_product():
    try:
        user_id = int(get_jwt_identity())
    except (TypeError, ValueError):
        return jsonify({'message': 'Invalid token identity'}), 422
    user = User.query.get(user_id)

    if not user or user.role not in ['manager', 'super_admin']:
        return jsonify({'message': 'Unauthorized'}), 403

    # Determine store_id based on user role
    if user.role == 'manager':
        if not user.store:
            return jsonify({'message': 'Manager has no associated store'}), 403
        store_id = user.store.id
    else:  # super_admin can specify store_id or default to none
        store_id = request.form.get('store_id')

    # Handle FormData instead of JSON
    name = request.form.get('name')
    description = request.form.get('description')
    price = request.form.get('price')
    stock_quantity = request.form.get('stock_quantity', 0)
    category_id = request.form.get('category_id')

    # Handle file upload: save image_1 to uploads/ and build image_url
    image_url = None
    if 'image_1' in request.files:
        image_file = request.files['image_1']
        if image_file and image_file.filename:
            # Determine uploads directory relative to project root (two levels up
            # from this file: server/routes -> server -> project root)
            ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
            uploads_dir = os.path.join(ROOT, 'uploads')
            os.makedirs(uploads_dir, exist_ok=True)

            # Use a time-prefixed secure filename to avoid collisions
            filename = f"{int(time.time())}_{secure_filename(image_file.filename)}"
            save_path = os.path.join(uploads_dir, filename)
            try:
                image_file.save(save_path)
                image_url = f"/uploads/{filename}"
            except Exception:
                # If saving fails, keep image_url as None and continue
                image_url = None

    if not name or not price:
        return jsonify({'message': 'Name and price are required'}), 400

    try:
        price = float(price)
        stock_quantity = int(stock_quantity) if stock_quantity else 0
    except ValueError:
        return jsonify({'message': 'Invalid price or stock quantity'}), 400

    # Get category name from category_id
    category_name = None
    if category_id:
        category_obj = Category.query.get(int(category_id))
        if category_obj:
            category_name = category_obj.name
        else:
            return jsonify({'message': 'Invalid category_id'}), 400

    new_product = Product(
        name=name,
        description=description,
        price=price,
        stock_quantity=stock_quantity,
        image_url=image_url,
        category=category_name,
        store_id=store_id
    )
    db.session.add(new_product)
    db.session.commit()

    return jsonify({'message': 'Product created successfully', 'product': {
        'id': new_product.id,
        'name': new_product.name,
        'description': new_product.description,
        'price': new_product.price,
        'stock_quantity': new_product.stock_quantity,
        'image_url': new_product.image_url,
        'category': new_product.category,
        'category_id': category_id,
        'store_name': new_product.store.name if new_product.store else 'Unknown Store'
    }}), 201

@products_bp.route('/products/<int:product_id>', methods=['PUT'])
@jwt_required()
def update_product(product_id):
    try:
        user_id = int(get_jwt_identity())
    except (TypeError, ValueError):
        return jsonify({'message': 'Invalid token identity'}), 422
    user = User.query.get(user_id)

    if not user or user.role not in ['manager', 'super_admin']:
        return jsonify({'message': 'Unauthorized'}), 403

    product = Product.query.get(product_id)
    if not product:
        return jsonify({'message': 'Product not found'}), 404

    # Check if user owns this product (for managers)
    if user.role == 'manager' and product.store_id != user.store.id:
        return jsonify({'message': 'Unauthorized to update this product'}), 403

    # Handle FormData instead of JSON
    name = request.form.get('name')
    description = request.form.get('description')
    price = request.form.get('price')
    stock_quantity = request.form.get('stock_quantity', 0)
    category_id = request.form.get('category_id')

    # Handle file upload: save image_1 to uploads/ and build image_url
    image_url = product.image_url  # Keep existing if no new image
    if 'image_1' in request.files:
        image_file = request.files['image_1']
        if image_file and image_file.filename:
            # Use project root uploads folder so it matches the path used by
            # `server/app.py` when serving uploaded files.
            ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
            uploads_dir = os.path.join(ROOT, 'uploads')
            os.makedirs(uploads_dir, exist_ok=True)
            filename = f"{int(time.time())}_{secure_filename(image_file.filename)}"
            save_path = os.path.join(uploads_dir, filename)
            try:
                image_file.save(save_path)
                image_url = f"/uploads/{filename}"
            except Exception:
                # On failure, keep previous image_url
                pass

    if not name or not price:
        return jsonify({'message': 'Name and price are required'}), 400

    try:
        price = float(price)
        stock_quantity = int(stock_quantity) if stock_quantity else 0
    except ValueError:
        return jsonify({'message': 'Invalid price or stock quantity'}), 400

    # Get category name from category_id
    category_name = None
    if category_id:
        category_obj = Category.query.get(int(category_id))
        if category_obj:
            category_name = category_obj.name
        else:
            return jsonify({'message': 'Invalid category_id'}), 400

    # Update product
    product.name = name
    product.description = description
    product.price = price
    product.stock_quantity = stock_quantity
    product.image_url = image_url
    product.category = category_name

    db.session.commit()

    return jsonify({'message': 'Product updated successfully', 'product': {
        'id': product.id,
        'name': product.name,
        'description': product.description,
        'price': product.price,
        'stock_quantity': product.stock_quantity,
        'image_url': product.image_url,
        'category': product.category,
        'category_id': category_id,
        'store_name': product.store.name if product.store else 'Unknown Store'
    }}), 200

@products_bp.route('/products/<int:product_id>', methods=['GET'])
def get_product(product_id):
    product = Product.query.get(product_id)
    if not product:
        return jsonify({'message': 'Product not found'}), 404

    category_obj = Category.query.filter_by(name=product.category).first() if product.category else None
    # Include reviews in the product payload
    reviews_q = Review.query.filter_by(product_id=product.id).order_by(Review.created_at.desc()).all()
    reviews_list = []
    total_rating = 0
    for r in reviews_q:
        reviewer_name = r.user_name
        if not reviewer_name and r.user_id:
            u = User.query.get(r.user_id)
            reviewer_name = u.name if u and u.name else (u.email if u else None)
        reviews_list.append({
            'id': r.id,
            'user_id': r.user_id,
            'user_name': reviewer_name,
            'rating': r.rating,
            'comment': r.comment,
            'created_at': r.created_at.isoformat()
        })
        try:
            total_rating += int(r.rating or 0)
        except Exception:
            pass

    avg_rating = None
    if len(reviews_list) > 0:
        avg_rating = round(total_rating / len(reviews_list), 2)

    product_data = {
        'id': product.id,
        'name': product.name,
        'description': product.description,
        'price': product.price,
        'stock_quantity': product.stock_quantity,
        'image_url': product.image_url,
        'category': product.category,
        'category_id': category_obj.id if category_obj else None,
        'store_name': product.store.name if product.store else 'Unknown Store',
        'created_at': product.created_at.isoformat(),
        'updated_at': product.updated_at.isoformat(),
        'reviews': reviews_list,
        'average_rating': avg_rating
    }
    return jsonify({'product': product_data}), 200


@products_bp.route('/products/<int:product_id>/recommendations', methods=['GET'])
def get_recommendations(product_id):
    """Return recommended products based on the same category as the given product.

    This is a simple heuristic: find other products with the same category and
    return up to 8 items, excluding the current product.
    """
    product = Product.query.get(product_id)
    if not product:
        return jsonify({'message': 'Product not found'}), 404

    if not product.category:
        # If product has no category, return an empty list
        return jsonify({'recommendations': []}), 200

    # Query candidate products in same category (exclude current product)
    candidates = Product.query.filter(Product.category == product.category, Product.id != product.id).all()

    # Score candidates by: same-store boost + popularity (order items) + recency
    scored = []
    for p in candidates:
        # popularity: total ordered quantity
        popularity = 0
        try:
            for oi in getattr(p, 'order_items', []) or []:
                popularity += (oi.quantity or 0)
        except Exception:
            popularity = 0

        # same store boost
        same_store = 1 if (p.store_id and product.store_id and p.store_id == product.store_id) else 0

        # recency factor (days since creation) -> newer is better
        recency = 0
        try:
            age_seconds = (product.created_at - p.created_at).total_seconds()
            recency = max(0, -age_seconds / (60 * 60 * 24))  # negative age -> positive recency
        except Exception:
            recency = 0

        score = (same_store * 100) + (popularity * 2) + recency
        scored.append((score, p))

    # sort by score desc and return top 8
    scored.sort(key=lambda x: x[0], reverse=True)
    top = [p for (_s, p) in scored[:8]]

    rec_list = []
    for p in top:
        rec_list.append({
            'id': p.id,
            'name': p.name,
            'price': p.price,
            'image_url': p.image_url,
            'store_name': p.store.name if p.store else 'Unknown Store',
            'created_at': p.created_at.isoformat(),
        })

    return jsonify({'recommendations': rec_list}), 200


@products_bp.route('/products/<int:product_id>/reviews', methods=['GET'])
def get_reviews(product_id):
    product = Product.query.get(product_id)
    if not product:
        return jsonify({'message': 'Product not found'}), 404

    reviews_q = Review.query.filter_by(product_id=product.id).order_by(Review.created_at.desc()).all()
    reviews_list = []
    for r in reviews_q:
        reviewer_name = r.user_name
        if not reviewer_name and r.user_id:
            u = User.query.get(r.user_id)
            reviewer_name = u.name if u and u.name else (u.email if u else None)
        reviews_list.append({
            'id': r.id,
            'user_id': r.user_id,
            'user_name': reviewer_name,
            'rating': r.rating,
            'comment': r.comment,
            'created_at': r.created_at.isoformat()
        })

    return jsonify({'reviews': reviews_list}), 200


@products_bp.route('/products/<int:product_id>/reviews', methods=['POST'])
def post_review(product_id):
    product = Product.query.get(product_id)
    if not product:
        return jsonify({'message': 'Product not found'}), 404

    # Attempt to parse JWT if present (optional)
    user_id = None
    try:
        verify_jwt_in_request(optional=True)
        identity = get_jwt_identity()
        if identity:
            try:
                user_id = int(identity)
            except Exception:
                user_id = None
    except Exception:
        # no valid JWT present
        user_id = None

    data = request.get_json() or {}
    rating = data.get('rating')
    comment = data.get('comment')
    user_name = data.get('user_name')

    if rating is None:
        return jsonify({'message': 'Rating is required'}), 400
    try:
        rating = int(rating)
    except ValueError:
        return jsonify({'message': 'Invalid rating'}), 400
    if rating < 1 or rating > 5:
        return jsonify({'message': 'Rating must be between 1 and 5'}), 400

    # If no logged in user, require user_name
    if not user_id and not user_name:
        return jsonify({'message': 'user_name is required for anonymous reviews'}), 400

    # Create review
    new_review = Review(
        product_id=product.id,
        user_id=user_id,
        user_name=user_name if user_name else None,
        rating=rating,
        comment=comment
    )
    db.session.add(new_review)
    db.session.commit()

    # Build response
    resp = {
        'id': new_review.id,
        'user_id': new_review.user_id,
        'user_name': new_review.user_name,
        'rating': new_review.rating,
        'comment': new_review.comment,
        'created_at': new_review.created_at.isoformat()
    }
    return jsonify({'review': resp}), 201

@products_bp.route('/products/<int:product_id>', methods=['DELETE'])
@jwt_required()
def delete_product(product_id):
    try:
        user_id = int(get_jwt_identity())
    except (TypeError, ValueError):
        return jsonify({'message': 'Invalid token identity'}), 422
    user = User.query.get(user_id)

    if not user or user.role not in ['manager', 'super_admin']:
        return jsonify({'message': 'Unauthorized'}), 403

    product = Product.query.get(product_id)
    if not product:
        return jsonify({'message': 'Product not found'}), 404

    # Check if user owns this product (for managers)
    if user.role == 'manager' and product.store_id != user.store.id:
        return jsonify({'message': 'Unauthorized to delete this product'}), 403

    db.session.delete(product)
    db.session.commit()

    return jsonify({'message': 'Product deleted successfully'}), 200
