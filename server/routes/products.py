from flask import Blueprint, jsonify, request
from werkzeug.utils import secure_filename
import os
import time
from flask_jwt_extended import jwt_required, get_jwt_identity, verify_jwt_in_request
from models import db, Product, User, Category, Store, Review, Comment, OrderItem, Commission, CommissionRate
from sqlalchemy import func

products_bp = Blueprint('products', __name__)

def get_review_stats_for_products(product_ids):
    """Get review stats for multiple products in a single query.
    
    Returns a dict {product_id: (avg_rating, review_count)}
    """
    if not product_ids:
        return {}
    
    stats = db.session.query(
        Review.product_id,
        func.avg(Review.rating).label('avg_rating'),
        func.count(Review.id).label('review_count')
    ).filter(Review.product_id.in_(product_ids)).group_by(Review.product_id).all()
    
    stats_map = {}
    for stat in stats:
        avg_rating = round(float(stat.avg_rating), 1) if stat.avg_rating else 0
        review_count = stat.review_count
        stats_map[stat.product_id] = (avg_rating, review_count)
    
    # For products with no reviews, set to (0, 0)
    for pid in product_ids:
        if pid not in stats_map:
            stats_map[pid] = (0, 0)
    
    return stats_map

@products_bp.route('/products', methods=['GET'])
def get_products():
    # Get query parameters for filtering
    search = request.args.get('search', '')
    category = request.args.get('category', '')
    district = request.args.get('district', '')
    min_price = request.args.get('min_price', type=float, default=0)
    max_price = request.args.get('max_price', type=float, default=float('inf'))
    stock = request.args.get('stock', '')
    page = request.args.get('page', type=int, default=1)
    per_page = request.args.get('per_page', type=int, default=10)

    # Build query
    query = Product.query

    if search:
        query = query.filter(
            (Product.name.ilike(f'%{search}%')) |
            (Product.description.ilike(f'%{search}%'))
        )

    if category:
        query = query.filter(Product.category == category)

    if district:
        query = query.filter(Product.district == district)

    query = query.filter(Product.price >= min_price, Product.price <= max_price)

    if stock:
        if stock == 'in-stock':
            query = query.filter(Product.stock_quantity > 0)
        elif stock == 'low-stock':
            query = query.filter(Product.stock_quantity >= 1, Product.stock_quantity <= 10)
        elif stock == 'out-of-stock':
            query = query.filter(Product.stock_quantity == 0)

    # Get total count before pagination
    total = query.count()

    # Apply pagination
    products = query.offset((page - 1) * per_page).limit(per_page).all()

    # Get review stats for all products in one query
    product_ids = [p.id for p in products]
    stats_map = get_review_stats_for_products(product_ids)

    product_list = []
    for product in products:
        category_obj = Category.query.filter_by(name=product.category).first() if product.category else None
        
        avg_rating, review_count = stats_map.get(product.id, (0, 0))
        
        product_list.append({
            'id': product.id,
            'name': product.name,
            'description': product.description,
            'price': product.price,
            'stock_quantity': product.stock_quantity,
            'image_url': product.image_url,
            'category': product.category,
            'district': product.district,
            'category_id': category_obj.id if category_obj else None,
            'store_name': product.store.name if product.store else 'Unknown Store',
            'store_id': product.store_id if product.store else None,
            'created_at': product.created_at.isoformat(),
            'updated_at': product.updated_at.isoformat(),
            'sale_type': product.sale_type,
            'sale_start_date': product.sale_start_date.isoformat() if product.sale_start_date else None,
            'sale_end_date': product.sale_end_date.isoformat() if product.sale_end_date else None,
            'sale_discount_percentage': product.sale_discount_percentage,
            'average_rating': avg_rating,
            'review_count': review_count
        })
    return jsonify({'products': product_list, 'total': total, 'page': page, 'per_page': per_page}), 200

@products_bp.route('/products', methods=['POST'])
@jwt_required()
def create_product():
    try:
        user_id = int(get_jwt_identity())
    except (TypeError, ValueError):
        return jsonify({'message': 'Invalid token identity'}), 422
    user = User.query.get(user_id)

    if not user or user.role != 'manager':
        return jsonify({'message': 'Unauthorized'}), 403

    # Determine store_id based on user role
    if not user.store:
        return jsonify({'message': 'Manager has no associated store'}), 403
    store_id = user.store.id

    # Handle FormData instead of JSON
    name = request.form.get('name')
    description = request.form.get('description')
    price = request.form.get('price')
    stock_quantity = request.form.get('stock_quantity', 0)
    category_id = request.form.get('category_id')
    district = request.form.get('district', '')
    is_featured = request.form.get('is_featured', 'false').lower() == 'true'

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

    # Validate sale fields
    from datetime import datetime
    sale_start = None
    sale_end = None
    sale_discount = None

    # Get sale fields from request
    sale_type = request.form.get('sale_type')
    sale_start_date = request.form.get('sale_start_date')
    sale_end_date = request.form.get('sale_end_date')
    sale_discount_percentage = request.form.get('sale_discount_percentage')

    if sale_start_date:
        try:
            sale_start = datetime.fromisoformat(sale_start_date.replace('Z', '+00:00'))
        except ValueError:
            return jsonify({'message': 'Invalid sale_start_date format. Use ISO format.'}), 400

    if sale_end_date:
        try:
            sale_end = datetime.fromisoformat(sale_end_date.replace('Z', '+00:00'))
        except ValueError:
            return jsonify({'message': 'Invalid sale_end_date format. Use ISO format.'}), 400

    if sale_discount_percentage:
        try:
            sale_discount = float(sale_discount_percentage)
            if sale_discount < 0 or sale_discount > 100:
                return jsonify({'message': 'sale_discount_percentage must be between 0 and 100'}), 400
        except ValueError:
            return jsonify({'message': 'Invalid sale_discount_percentage'}), 400

    # Validate that if sale fields are provided, they are consistent
    if sale_type and not (sale_start and sale_end and sale_discount is not None):
        return jsonify({'message': 'If sale_type is provided, sale_start_date, sale_end_date, and sale_discount_percentage are required'}), 400
    if (sale_start or sale_end or sale_discount is not None) and not sale_type:
        return jsonify({'message': 'If sale dates or discount are provided, sale_type is required'}), 400
    if sale_start and sale_end and sale_start >= sale_end:
        return jsonify({'message': 'sale_start_date must be before sale_end_date'}), 400

    new_product = Product(
        name=name,
        description=description,
        price=price,
        stock_quantity=stock_quantity,
        image_url=image_url,
        category=category_name,
        district=district,
        store_id=store_id,
        is_featured=is_featured,
        sale_type=sale_type,
        sale_start_date=sale_start,
        sale_end_date=sale_end,
        sale_discount_percentage=sale_discount
    )
    db.session.add(new_product)
    db.session.commit()

    # Automatically assign commission based on product price and commission rates
    applicable_rate = CommissionRate.query.filter(
        CommissionRate.is_active == True,
        CommissionRate.min_price <= price,
        db.or_(CommissionRate.max_price.is_(None), CommissionRate.max_price >= price)
    ).first()
    
    if applicable_rate:
        commission = Commission(
            product_id=new_product.id,
            store_id=store_id,
            commission_percentage=applicable_rate.commission_percentage,
            commission_amount=None,
            is_manual=False
        )
        db.session.add(commission)
        db.session.commit()

    return jsonify({'message': 'Product created successfully', 'product': {
        'id': new_product.id,
        'name': new_product.name,
        'description': new_product.description,
        'price': new_product.price,
        'stock_quantity': new_product.stock_quantity,
        'image_url': new_product.image_url,
        'category': new_product.category,
        'district': new_product.district,
        'category_id': category_id,
        'store_name': new_product.store.name if new_product.store else 'Unknown Store',
        'sale_type': new_product.sale_type,
        'sale_start_date': new_product.sale_start_date.isoformat() if new_product.sale_start_date else None,
        'sale_end_date': new_product.sale_end_date.isoformat() if new_product.sale_end_date else None,
        'sale_discount_percentage': new_product.sale_discount_percentage
    }}), 201

@products_bp.route('/products/<int:product_id>', methods=['PUT'])
@jwt_required()
def update_product(product_id):
    try:
        user_id = int(get_jwt_identity())
    except (TypeError, ValueError):
        return jsonify({'message': 'Invalid token identity'}), 422
    user = User.query.get(user_id)

    if not user or user.role != 'manager':
        return jsonify({'message': 'Unauthorized'}), 403

    product = Product.query.get(product_id)
    if not product:
        return jsonify({'message': 'Product not found'}), 404

    # Check if user owns this product
    if product.store_id != user.store.id:
        return jsonify({'message': 'Unauthorized to update this product'}), 403

    # Handle FormData instead of JSON
    name = request.form.get('name')
    description = request.form.get('description')
    price = request.form.get('price')
    stock_quantity = request.form.get('stock_quantity', 0)
    category_id = request.form.get('category_id')
    district = request.form.get('district')
    # Get is_featured field
    is_featured = request.form.get('is_featured', 'false').lower() == 'true'
    # Sale fields
    sale_type = request.form.get('sale_type')
    sale_start_date = request.form.get('sale_start_date')
    sale_end_date = request.form.get('sale_end_date')
    sale_discount_percentage = request.form.get('sale_discount_percentage')

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

    # Get is_featured field
    is_featured = request.form.get('is_featured', 'false').lower() == 'true'

    # Validate sale fields
    from datetime import datetime
    sale_start = None
    sale_end = None
    sale_discount = None

    # Get sale fields from request
    sale_type = request.form.get('sale_type')
    sale_start_date = request.form.get('sale_start_date')
    sale_end_date = request.form.get('sale_end_date')
    sale_discount_percentage = request.form.get('sale_discount_percentage')

    if sale_start_date:
        try:
            sale_start = datetime.fromisoformat(sale_start_date.replace('Z', '+00:00'))
        except ValueError:
            return jsonify({'message': 'Invalid sale_start_date format. Use ISO format.'}), 400

    if sale_end_date:
        try:
            sale_end = datetime.fromisoformat(sale_end_date.replace('Z', '+00:00'))
        except ValueError:
            return jsonify({'message': 'Invalid sale_end_date format. Use ISO format.'}), 400

    if sale_discount_percentage:
        try:
            sale_discount = float(sale_discount_percentage)
            if sale_discount < 0 or sale_discount > 100:
                return jsonify({'message': 'sale_discount_percentage must be between 0 and 100'}), 400
        except ValueError:
            return jsonify({'message': 'Invalid sale_discount_percentage'}), 400

    # Validate that if sale fields are provided, they are consistent
    if sale_type and not (sale_start and sale_end and sale_discount is not None):
        return jsonify({'message': 'If sale_type is provided, sale_start_date, sale_end_date, and sale_discount_percentage are required'}), 400
    if (sale_start or sale_end or sale_discount is not None) and not sale_type:
        return jsonify({'message': 'If sale dates or discount are provided, sale_type is required'}), 400
    if sale_start and sale_end and sale_start >= sale_end:
        return jsonify({'message': 'sale_start_date must be before sale_end_date'}), 400

    # Update product
    product.name = name
    product.description = description
    product.price = price
    product.stock_quantity = stock_quantity
    product.image_url = image_url
    product.category = category_name
    product.district = district
    product.is_featured = is_featured
    product.sale_type = sale_type
    product.sale_start_date = sale_start
    product.sale_end_date = sale_end
    product.sale_discount_percentage = sale_discount

    db.session.commit()

    # Update commission if price changed (find new applicable rate)
    applicable_rate = CommissionRate.query.filter(
        CommissionRate.is_active == True,
        CommissionRate.min_price <= price,
        db.or_(CommissionRate.max_price.is_(None), CommissionRate.max_price >= price)
    ).first()
    
    existing_commission = Commission.query.filter_by(product_id=product.id).first()

    if applicable_rate:
        if existing_commission and not existing_commission.is_manual:
            # Update auto-generated commission to keep tier alignment
            existing_commission.commission_percentage = applicable_rate.commission_percentage
            existing_commission.commission_amount = None
            db.session.commit()
        elif not existing_commission:
            # Create new commission record for tier defaults
            commission = Commission(
                product_id=product.id,
                store_id=product.store_id,
                commission_percentage=applicable_rate.commission_percentage,
                commission_amount=None,
                is_manual=False
            )
            db.session.add(commission)
            db.session.commit()

    return jsonify({'message': 'Product updated successfully', 'product': {
        'id': product.id,
        'name': product.name,
        'description': product.description,
        'price': product.price,
        'stock_quantity': product.stock_quantity,
        'image_url': product.image_url,
        'category': product.category,
        'district': product.district,
        'category_id': category_id,
        'store_name': product.store.name if product.store else 'Unknown Store',
        'sale_type': product.sale_type,
        'sale_start_date': product.sale_start_date.isoformat() if product.sale_start_date else None,
        'sale_end_date': product.sale_end_date.isoformat() if product.sale_end_date else None,
        'sale_discount_percentage': product.sale_discount_percentage
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

    avg_rating = 0
    if len(reviews_list) > 0:
        avg_rating = round(total_rating / len(reviews_list), 1)

    review_count = len(reviews_list)

    # Calculate store stats
    store = product.store
    store_rating = None
    store_total_reviews = 0
    store_products_sold = 0
    if store:
        # Get all products for the store
        store_products = Product.query.filter_by(store_id=store.id).all()
        store_product_ids = [p.id for p in store_products]

        # Calculate average rating across all store products
        store_reviews = Review.query.filter(Review.product_id.in_(store_product_ids)).all()
        store_total_reviews = len(store_reviews)
        if store_reviews:
            total_store_rating = sum(r.rating for r in store_reviews if r.rating)
            store_rating = round(total_store_rating / len([r for r in store_reviews if r.rating]), 1) if total_store_rating else None

        # Calculate total products sold (sum of order item quantities)
        from sqlalchemy import func
        sold_result = db.session.query(func.sum(OrderItem.quantity)).filter(OrderItem.product_id.in_(store_product_ids)).scalar()
        store_products_sold = sold_result or 0

    product_data = {
        'id': product.id,
        'name': product.name,
        'description': product.description,
        'price': product.price,
        'stock_quantity': product.stock_quantity,
        'image_url': product.image_url,
        'category': product.category,
        'district': product.district,
        'category_id': category_obj.id if category_obj else None,
        'store_name': product.store.name if product.store else 'Unknown Store',
        'store_id': product.store_id if product.store else None,
        'store_logo_url': product.store.logo_url if product.store else None,
        'store_rating': store_rating,
        'store_total_reviews': store_total_reviews,
        'store_products_sold': store_products_sold,
        'created_at': product.created_at.isoformat(),
        'updated_at': product.updated_at.isoformat(),
        'reviews': reviews_list,
        'average_rating': avg_rating,
        'review_count': review_count,
        'sale_type': product.sale_type,
        'sale_start_date': product.sale_start_date.isoformat() if product.sale_start_date else None,
        'sale_end_date': product.sale_end_date.isoformat() if product.sale_end_date else None,
        'sale_discount_percentage': product.sale_discount_percentage
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

    # Get review stats for all products in one query
    product_ids = [p.id for p in top]
    stats_map = get_review_stats_for_products(product_ids)

    rec_list = []
    for p in top:
        avg_rating, review_count = stats_map.get(p.id, (0, 0))
        
        rec_list.append({
            'id': p.id,
            'name': p.name,
            'price': p.price,
            'image_url': p.image_url,
            'store_name': p.store.name if p.store else 'Unknown Store',
            'created_at': p.created_at.isoformat(),
            'district': p.district,
            'sale_type': p.sale_type,
            'sale_start_date': p.sale_start_date.isoformat() if p.sale_start_date else None,
            'sale_end_date': p.sale_end_date.isoformat() if p.sale_end_date else None,
            'sale_discount_percentage': p.sale_discount_percentage,
            'average_rating': avg_rating,
            'review_count': review_count
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


@products_bp.route('/products/<int:product_id>/comments', methods=['GET'])
def get_comments(product_id):
    product = Product.query.get(product_id)
    if not product:
        return jsonify({'message': 'Product not found'}), 404

    comments_q = Comment.query.filter_by(product_id=product.id).order_by(Comment.created_at.desc()).all()
    comments_list = []
    for c in comments_q:
        commenter_name = c.user_name
        if not commenter_name and c.user_id:
            u = User.query.get(c.user_id)
            commenter_name = u.name if u and u.name else (u.email if u else None)
        comments_list.append({
            'id': c.id,
            'user_id': c.user_id,
            'user_name': commenter_name,
            'comment': c.comment,
            'created_at': c.created_at.isoformat()
        })

    return jsonify({'comments': comments_list}), 200


@products_bp.route('/products/<int:product_id>/comments', methods=['POST'])
def post_comment(product_id):
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
    comment = data.get('comment')
    user_name = data.get('user_name')

    if not comment:
        return jsonify({'message': 'Comment is required'}), 400

    # If no logged in user, require user_name
    if not user_id and not user_name:
        return jsonify({'message': 'user_name is required for anonymous comments'}), 400

    # Create comment
    new_comment = Comment(
        product_id=product.id,
        user_id=user_id,
        user_name=user_name if user_name else None,
        comment=comment
    )
    db.session.add(new_comment)
    db.session.commit()

    # Build response
    resp = {
        'id': new_comment.id,
        'user_id': new_comment.user_id,
        'user_name': new_comment.user_name,
        'comment': new_comment.comment,
        'created_at': new_comment.created_at.isoformat()
    }
    return jsonify({'comment': resp}), 201

@products_bp.route('/products/<int:product_id>', methods=['DELETE'])
@jwt_required()
def delete_product(product_id):
    try:
        user_id = int(get_jwt_identity())
    except (TypeError, ValueError):
        return jsonify({'message': 'Invalid token identity'}), 422
    user = User.query.get(user_id)

    if not user or user.role != 'manager':
        return jsonify({'message': 'Unauthorized'}), 403

    product = Product.query.get(product_id)
    if not product:
        return jsonify({'message': 'Product not found'}), 404

    # Check if user owns this product
    if product.store_id != user.store.id:
        return jsonify({'message': 'Unauthorized to delete this product'}), 403

    db.session.delete(product)
    db.session.commit()

    return jsonify({'message': 'Product deleted successfully'}), 200

@products_bp.route('/comments/counts', methods=['GET'])
@jwt_required()
def get_comments_counts():
    try:
        user_id = int(get_jwt_identity())
    except (TypeError, ValueError):
        return jsonify({'message': 'Invalid token identity'}), 422
    user = User.query.get(user_id)

    if not user or user.role not in ['manager', 'super_admin']:
        return jsonify({'message': 'Unauthorized'}), 403

    # Get comment counts per product
    from sqlalchemy import func
    comment_counts = db.session.query(
        Comment.product_id,
        func.count(Comment.id).label('count')
    ).group_by(Comment.product_id).all()

    # Build response with product details
    counts_list = []
    for product_id, count in comment_counts:
        product = Product.query.get(product_id)
        if product:
            counts_list.append({
                'product_id': product_id,
                'product_name': product.name,
                'store_name': product.store.name if product.store else 'Unknown Store',
                'comment_count': count
            })

    return jsonify({'comment_counts': counts_list}), 200


@products_bp.route('/comments/all', methods=['GET'])
@jwt_required()
def get_all_comments():
    try:
        user_id = int(get_jwt_identity())
    except (TypeError, ValueError):
        return jsonify({'message': 'Invalid token identity'}), 422
    user = User.query.get(user_id)

    if not user or user.role not in ['manager', 'super_admin']:
        return jsonify({'message': 'Unauthorized'}), 403

    # Get all comments with product and store info
    comments_query = Comment.query.join(Product, Comment.product_id == Product.id).add_columns(
        Product.name.label('product_name'),
        Product.store_id.label('store_id')
    ).order_by(Comment.created_at.desc()).all()

    comments_list = []
    for comment, product_name, store_id in comments_query:
        store = Store.query.get(store_id) if store_id else None
        comments_list.append({
            'id': comment.id,
            'product_id': comment.product_id,
            'product_name': product_name,
            'store_name': store.name if store else 'Unknown Store',
            'user_id': comment.user_id,
            'user_name': comment.user_name,
            'comment': comment.comment,
            'created_at': comment.created_at.isoformat()
        })

    return jsonify({'comments': comments_list}), 200


@products_bp.route('/comments/<int:comment_id>', methods=['DELETE'])
@jwt_required()
def delete_comment(comment_id):
    try:
        user_id = int(get_jwt_identity())
    except (TypeError, ValueError):
        return jsonify({'message': 'Invalid token identity'}), 422
    user = User.query.get(user_id)

    if not user or user.role != 'manager':
        return jsonify({'message': 'Unauthorized'}), 403

    comment = Comment.query.get(comment_id)
    if not comment:
        return jsonify({'message': 'Comment not found'}), 404

    # For managers, check if the comment belongs to their store's products
    product = Product.query.get(comment.product_id)
    if not product or product.store_id != user.store.id:
        return jsonify({'message': 'Unauthorized to delete this comment'}), 403

    db.session.delete(comment)
    db.session.commit()

    return jsonify({'message': 'Comment deleted successfully'}), 200


@products_bp.route('/stores/<int:store_id>', methods=['GET'])
def get_store(store_id):
    store = Store.query.get(store_id)
    if not store:
        return jsonify({'message': 'Store not found'}), 404

    # Get all products for this store
    products = Product.query.filter_by(store_id=store_id).all()

    # Get review stats for all products in one query
    product_ids = [p.id for p in products]
    stats_map = get_review_stats_for_products(product_ids)

    product_list = []
    for product in products:
        category_obj = Category.query.filter_by(name=product.category).first() if product.category else None
        
        avg_rating, review_count = stats_map.get(product.id, (0, 0))
        
        product_list.append({
            'id': product.id,
            'name': product.name,
            'description': product.description,
            'price': product.price,
            'stock_quantity': product.stock_quantity,
            'image_url': product.image_url,
            'category': product.category,
            'district': product.district,
            'category_id': category_obj.id if category_obj else None,
            'store_name': store.name,
            'store_id': store.id,
            'created_at': product.created_at.isoformat(),
            'updated_at': product.updated_at.isoformat(),
            'sale_type': product.sale_type,
            'sale_start_date': product.sale_start_date.isoformat() if product.sale_start_date else None,
            'sale_end_date': product.sale_end_date.isoformat() if product.sale_end_date else None,
            'sale_discount_percentage': product.sale_discount_percentage,
            'average_rating': avg_rating,
            'review_count': review_count
        })

    # Calculate store-level rating statistics
    # Get all reviews for store products
    store_reviews = Review.query.filter(Review.product_id.in_(product_ids)).all() if product_ids else []
    store_total_reviews = len(store_reviews)
    
    # Calculate average rating
    if store_reviews:
        total_store_rating = sum(r.rating for r in store_reviews if r.rating)
        store_avg_rating = round(total_store_rating / len([r for r in store_reviews if r.rating]), 1) if total_store_rating else 0
    else:
        store_avg_rating = 0

    store_data = {
        'id': store.id,
        'name': store.name,
        'address': store.address,
        'logo_url': store.logo_url,
        'contact_number': store.contact_number,
        'description': store.description,
        'manager_id': store.manager_id,
        'created_at': store.created_at.isoformat(),
        'updated_at': store.updated_at.isoformat(),
        'products': product_list,
        'average_rating': store_avg_rating,
        'total_reviews': store_total_reviews
    }

    return jsonify({'store': store_data}), 200


@products_bp.route('/products/featured', methods=['GET'])
def get_featured_products():
    """Get featured products for homepage display."""
    try:
        featured_products = Product.query.filter_by(is_featured=True).order_by(
            Product.featured_order, Product.created_at.desc()
        ).limit(6).all()

        # Get review stats for all products in one query
        product_ids = [p.id for p in featured_products]
        stats_map = get_review_stats_for_products(product_ids)

        featured_list = []
        for product in featured_products:
            category_obj = Category.query.filter_by(name=product.category).first() if product.category else None
            
            avg_rating, review_count = stats_map.get(product.id, (0, 0))
            
            featured_list.append({
                'id': product.id,
                'name': product.name,
                'description': product.description,
                'price': product.price,
                'stock_quantity': product.stock_quantity,
                'image_url': product.image_url,
                'category': product.category,
                'category_id': category_obj.id if category_obj else None,
                'store_name': product.store.name if product.store else 'Unknown Store',
                'store_id': product.store_id if product.store else None,
                'created_at': product.created_at.isoformat(),
                'updated_at': product.updated_at.isoformat(),
                'sale_type': product.sale_type,
                'sale_start_date': product.sale_start_date.isoformat() if product.sale_start_date else None,
                'sale_end_date': product.sale_end_date.isoformat() if product.sale_end_date else None,
                'sale_discount_percentage': product.sale_discount_percentage,
                'is_featured': product.is_featured,
                'is_new_arrival': product.is_new_arrival,
                'featured_order': product.featured_order,
                'new_arrival_order': product.new_arrival_order,
                'average_rating': avg_rating,
                'review_count': review_count
            })

        return jsonify({'products': featured_list}), 200
    except Exception as e:
        print(f"Error fetching featured products: {e}")
        return jsonify({'message': 'Error fetching featured products', 'products': []}), 500


@products_bp.route('/products/new-arrivals', methods=['GET'])
def get_new_arrivals():
    """Get new arrival products for homepage display."""
    try:
        from datetime import datetime, timedelta

        # Products created in last 30 days OR explicitly marked as new arrival
        thirty_days_ago = datetime.utcnow() - timedelta(days=30)

        new_arrival_products = Product.query.filter(
            db.or_(
                Product.created_at >= thirty_days_ago,
                Product.is_new_arrival == True
            )
        ).order_by(Product.created_at.desc()).limit(8).all()

        # Get review stats for all products in one query
        product_ids = [p.id for p in new_arrival_products]
        stats_map = get_review_stats_for_products(product_ids)

        new_arrival_list = []
        for product in new_arrival_products:
            category_obj = Category.query.filter_by(name=product.category).first() if product.category else None
            
            avg_rating, review_count = stats_map.get(product.id, (0, 0))
            
            new_arrival_list.append({
                'id': product.id,
                'name': product.name,
                'description': product.description,
                'price': product.price,
                'stock_quantity': product.stock_quantity,
                'image_url': product.image_url,
                'category': product.category,
                'category_id': category_obj.id if category_obj else None,
                'store_name': product.store.name if product.store else 'Unknown Store',
                'store_id': product.store_id if product.store else None,
                'created_at': product.created_at.isoformat(),
                'updated_at': product.updated_at.isoformat(),
                'sale_type': product.sale_type,
                'sale_start_date': product.sale_start_date.isoformat() if product.sale_start_date else None,
                'sale_end_date': product.sale_end_date.isoformat() if product.sale_end_date else None,
                'sale_discount_percentage': product.sale_discount_percentage,
                'is_featured': product.is_featured,
                'is_new_arrival': product.is_new_arrival,
                'featured_order': product.featured_order,
                'new_arrival_order': product.new_arrival_order,
                'average_rating': avg_rating,
                'review_count': review_count
            })

        return jsonify({'products': new_arrival_list}), 200
    except Exception as e:
        print(f"Error fetching new arrivals: {e}")
        return jsonify({'message': 'Error fetching new arrivals', 'products': []}), 500


@products_bp.route('/products/top-sales', methods=['GET'])
def get_top_sale_products():
    """Get top sale products (products currently on sale with highest discount)."""
    try:
        from datetime import datetime

        # Get current time for sale validation
        now = datetime.utcnow()

        # Products that are currently on sale (active sales)
        top_sale_products = Product.query.filter(
            Product.sale_type.isnot(None),
            Product.sale_start_date <= now,
            Product.sale_end_date >= now,
            Product.sale_discount_percentage > 0
        ).order_by(
            Product.sale_discount_percentage.desc(),  # Highest discount first
            Product.created_at.desc()  # Then by newest
        ).limit(6).all()

        # Get review stats for all products in one query
        product_ids = [p.id for p in top_sale_products]
        stats_map = get_review_stats_for_products(product_ids)

        top_sale_list = []
        for product in top_sale_products:
            category_obj = Category.query.filter_by(name=product.category).first() if product.category else None
            
            avg_rating, review_count = stats_map.get(product.id, (0, 0))
            
            top_sale_list.append({
                'id': product.id,
                'name': product.name,
                'description': product.description,
                'price': product.price,
                'stock_quantity': product.stock_quantity,
                'image_url': product.image_url,
                'category': product.category,
                'category_id': category_obj.id if category_obj else None,
                'store_name': product.store.name if product.store else 'Unknown Store',
                'store_id': product.store_id if product.store else None,
                'created_at': product.created_at.isoformat(),
                'updated_at': product.updated_at.isoformat(),
                'sale_type': product.sale_type,
                'sale_start_date': product.sale_start_date.isoformat() if product.sale_start_date else None,
                'sale_end_date': product.sale_end_date.isoformat() if product.sale_end_date else None,
                'sale_discount_percentage': product.sale_discount_percentage,
                'is_featured': product.is_featured,
                'is_new_arrival': product.is_new_arrival,
                'featured_order': product.featured_order,
                'new_arrival_order': product.new_arrival_order,
                'average_rating': avg_rating,
                'review_count': review_count
            })

        return jsonify({'products': top_sale_list}), 200
    except Exception as e:
        print(f"Error fetching top sale products: {e}")
        return jsonify({'message': 'Error fetching top sale products', 'products': []}), 500
