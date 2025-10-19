from flask import Blueprint, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from db import db
from db.models import (
    Product, Review, User, Size, Color, Material, ShippingCountry,
    ProductSize, ProductColor, ProductMaterial, ProductShipping, Category, Brand
)
from sqlalchemy import desc

products_bp = Blueprint('products', __name__)

# ============================================================================
# ATTRIBUTE ENDPOINTS (Admin endpoints to manage global attributes)
# ============================================================================

@products_bp.route('/attributes/sizes', methods=['GET'])
def get_sizes():
    """Get all available sizes"""
    sizes = Size.query.all()
    return {'sizes': [s.to_dict() for s in sizes]}, 200


@products_bp.route('/attributes/colors', methods=['GET'])
def get_colors():
    """Get all available colors"""
    colors = Color.query.all()
    return {'colors': [c.to_dict() for c in colors]}, 200


@products_bp.route('/attributes/materials', methods=['GET'])
def get_materials():
    """Get all available materials"""
    materials = Material.query.all()
    return {'materials': [m.to_dict() for m in materials]}, 200


@products_bp.route('/attributes/countries', methods=['GET'])
def get_shipping_countries():
    """Get all shipping countries"""
    countries = ShippingCountry.query.filter_by(is_active=True).all()
    return {'countries': [c.to_dict() for c in countries]}, 200


@products_bp.route('/attributes/sizes', methods=['POST'])
@jwt_required()
def create_size():
    """Create new size (admin only)"""
    user = User.query.get(get_jwt_identity())
    if not user or user.role != 'admin':
        return {'error': 'Unauthorized'}, 403
    
    data = request.get_json()
    if not data or 'name' not in data:
        return {'error': 'Missing size name'}, 400
    
    try:
        size = Size(name=data['name'], description=data.get('description'))
        db.session.add(size)
        db.session.commit()
        return {'size': size.to_dict()}, 201
    except Exception as e:
        db.session.rollback()
        return {'error': str(e)}, 500


@products_bp.route('/attributes/colors', methods=['POST'])
@jwt_required()
def create_color():
    """Create new color (admin only)"""
    user = User.query.get(get_jwt_identity())
    if not user or user.role != 'admin':
        return {'error': 'Unauthorized'}, 403
    
    data = request.get_json()
    if not data or 'name' not in data:
        return {'error': 'Missing color name'}, 400
    
    try:
        color = Color(
            name=data['name'],
            hex_code=data.get('hex_code')
        )
        db.session.add(color)
        db.session.commit()
        return {'color': color.to_dict()}, 201
    except Exception as e:
        db.session.rollback()
        return {'error': str(e)}, 500


@products_bp.route('/attributes/materials', methods=['POST'])
@jwt_required()
def create_material():
    """Create new material (admin only)"""
    user = User.query.get(get_jwt_identity())
    if not user or user.role != 'admin':
        return {'error': 'Unauthorized'}, 403
    
    data = request.get_json()
    if not data or 'name' not in data:
        return {'error': 'Missing material name'}, 400
    
    try:
        material = Material(
            name=data['name'],
            description=data.get('description')
        )
        db.session.add(material)
        db.session.commit()
        return {'material': material.to_dict()}, 201
    except Exception as e:
        db.session.rollback()
        return {'error': str(e)}, 500


@products_bp.route('/attributes/countries', methods=['POST'])
@jwt_required()
def create_shipping_country():
    """Create new shipping country (admin only)"""
    user = User.query.get(get_jwt_identity())
    if not user or user.role != 'admin':
        return {'error': 'Unauthorized'}, 403
    
    data = request.get_json()
    if not data or 'name' not in data:
        return {'error': 'Missing country name'}, 400
    
    try:
        country = ShippingCountry(
            name=data['name'],
            country_code=data.get('country_code'),
            shipping_cost=data.get('shipping_cost', 0),
            estimated_days=data.get('estimated_days', 7)
        )
        db.session.add(country)
        db.session.commit()
        return {'country': country.to_dict()}, 201
    except Exception as e:
        db.session.rollback()
        return {'error': str(e)}, 500


# ============================================================================
# PRODUCT ENDPOINTS
# ============================================================================

@products_bp.route('', methods=['GET'])
def get_products():
    """Get all products with filtering and pagination"""
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 12, type=int)
    category = request.args.get('category', type=str)
    search = request.args.get('search', type=str)
    sort = request.args.get('sort', 'latest', type=str)
    
    query = Product.query.filter_by(is_active=True)
    
    # Filter by category
    if category:
        query = query.filter_by(category=category)
    
    # Search
    if search:
        query = query.filter(
            db.or_(
                Product.title.ilike(f'%{search}%'),
                Product.description.ilike(f'%{search}%')
            )
        )
    
    # Sorting
    if sort == 'price_low':
        query = query.order_by(Product.price.asc())
    elif sort == 'price_high':
        query = query.order_by(Product.price.desc())
    elif sort == 'rating':
        query = query.order_by(desc(Product.rating))
    else:
        query = query.order_by(desc(Product.created_at))
    
    paginated = query.paginate(page=page, per_page=per_page)
    
    return {
        'products': [p.to_dict() for p in paginated.items],
        'total': paginated.total,
        'pages': paginated.pages,
        'current_page': page
    }, 200


@products_bp.route('/<product_id>', methods=['GET'])
def get_product(product_id):
    """Get single product with reviews"""
    product = Product.query.get(product_id)
    
    if not product or not product.is_active:
        return {'error': 'Product not found'}, 404
    
    reviews = Review.query.filter_by(product_id=product_id).all()
    
    return {
        'product': product.to_dict(),
        'reviews': [r.to_dict() for r in reviews]
    }, 200


@products_bp.route('', methods=['POST'])
@jwt_required()
def create_product():
    """Create new product with attributes (seller only)
    
    Request body:
    {
        "title": "string",
        "description": "string",
        "price": float,
        "discount_percent": int,
        "stock": int,
        "category_id": "uuid",
        "brand_id": "uuid",
        "image_url": "string",
        "sizes": [
            {"size_id": "uuid", "stock": int},
            ...
        ],
        "colors": [
            {"color_id": "uuid"},
            ...
        ],
        "materials": [
            {"material_id": "uuid", "percentage": int},
            ...
        ],
        "shipping_countries": [
            {"country_id": "uuid", "is_available": bool},
            ...
        ]
    }
    """
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    
    if not user or user.role not in ['seller', 'admin']:
        return {'error': 'Unauthorized'}, 403
    
    data = request.get_json()
    
    if not data or not all(key in data for key in ['title', 'price', 'category_id']):
        return {'error': 'Missing required fields: title, price, category_id'}, 400
    
    # Verify category exists
    category = Category.query.get(data.get('category_id'))
    if not category:
        return {'error': 'Category not found'}, 404
    
    # Verify brand exists if provided
    brand = None
    if data.get('brand_id'):
        brand = Brand.query.get(data.get('brand_id'))
        if not brand:
            return {'error': 'Brand not found'}, 404
    
    try:
        # Create product
        product = Product(
            title=data.get('title'),
            description=data.get('description'),
            price=data.get('price'),
            discount_percent=data.get('discount_percent', 0),
            stock=data.get('stock', 0),
            category_id=data.get('category_id'),
            brand_id=data.get('brand_id'),
            image_url=data.get('image_url'),
            seller_id=user_id
        )
        
        db.session.add(product)
        db.session.flush()  # Flush to get product ID without committing
        
        # Add sizes
        if 'sizes' in data and data['sizes']:
            for size_data in data['sizes']:
                size_id = size_data.get('size_id')
                stock = size_data.get('stock', 1)
                
                # Verify size exists
                size = Size.query.get(size_id)
                if not size:
                    return {'error': f'Size {size_id} not found'}, 400
                
                product_size = ProductSize(
                    product_id=product.id,
                    size_id=size_id,
                    stock=stock
                )
                db.session.add(product_size)
        
        # Add colors
        if 'colors' in data and data['colors']:
            for color_data in data['colors']:
                color_id = color_data.get('color_id')
                
                # Verify color exists
                color = Color.query.get(color_id)
                if not color:
                    return {'error': f'Color {color_id} not found'}, 400
                
                product_color = ProductColor(
                    product_id=product.id,
                    color_id=color_id
                )
                db.session.add(product_color)
        
        # Add materials
        if 'materials' in data and data['materials']:
            for material_data in data['materials']:
                material_id = material_data.get('material_id')
                percentage = material_data.get('percentage', 100)
                
                # Verify material exists
                material = Material.query.get(material_id)
                if not material:
                    return {'error': f'Material {material_id} not found'}, 400
                
                product_material = ProductMaterial(
                    product_id=product.id,
                    material_id=material_id,
                    percentage=percentage
                )
                db.session.add(product_material)
        
        # Add shipping countries
        if 'shipping_countries' in data and data['shipping_countries']:
            for country_data in data['shipping_countries']:
                country_id = country_data.get('country_id')
                is_available = country_data.get('is_available', True)
                
                # Verify country exists
                country = ShippingCountry.query.get(country_id)
                if not country:
                    return {'error': f'Country {country_id} not found'}, 400
                
                product_shipping = ProductShipping(
                    product_id=product.id,
                    country_id=country_id,
                    is_available=is_available
                )
                db.session.add(product_shipping)
        
        db.session.commit()
        
        return {
            'message': 'Product created successfully',
            'product': product.to_dict()
        }, 201
    except Exception as e:
        db.session.rollback()
        return {'error': str(e)}, 500


@products_bp.route('/<product_id>', methods=['PUT'])
@jwt_required()
def update_product(product_id):
    """Update product (seller or admin only)"""
    user_id = get_jwt_identity()
    product = Product.query.get(product_id)
    
    if not product:
        return {'error': 'Product not found'}, 404
    
    if product.seller_id != user_id and User.query.get(user_id).role != 'admin':
        return {'error': 'Unauthorized'}, 403
    
    data = request.get_json()
    
    try:
        if 'title' in data:
            product.title = data['title']
        if 'description' in data:
            product.description = data['description']
        if 'price' in data:
            product.price = data['price']
        if 'discount_percent' in data:
            product.discount_percent = data['discount_percent']
        if 'stock' in data:
            product.stock = data['stock']
        if 'category' in data:
            product.category = data['category']
        if 'image_url' in data:
            product.image_url = data['image_url']
        
        db.session.commit()
        
        return {
            'message': 'Product updated successfully',
            'product': product.to_dict()
        }, 200
    except Exception as e:
        db.session.rollback()
        return {'error': str(e)}, 500


@products_bp.route('/<product_id>/attributes', methods=['PUT'])
@jwt_required()
def update_product_attributes(product_id):
    """Update product attributes (seller or admin only)
    
    Request body:
    {
        "sizes": [
            {"size_id": "uuid", "stock": int},
            ...
        ],
        "colors": [
            {"color_id": "uuid"},
            ...
        ],
        "materials": [
            {"material_id": "uuid", "percentage": int},
            ...
        ],
        "shipping_countries": [
            {"country_id": "uuid", "is_available": bool},
            ...
        ]
    }
    """
    user_id = get_jwt_identity()
    product = Product.query.get(product_id)
    
    if not product:
        return {'error': 'Product not found'}, 404
    
    if product.seller_id != user_id and User.query.get(user_id).role != 'admin':
        return {'error': 'Unauthorized'}, 403
    
    data = request.get_json()
    
    try:
        # Update sizes
        if 'sizes' in data:
            # Remove existing sizes
            ProductSize.query.filter_by(product_id=product_id).delete()
            
            # Add new sizes
            for size_data in data['sizes']:
                size_id = size_data.get('size_id')
                stock = size_data.get('stock', 1)
                
                # Verify size exists
                size = Size.query.get(size_id)
                if not size:
                    return {'error': f'Size {size_id} not found'}, 400
                
                product_size = ProductSize(
                    product_id=product_id,
                    size_id=size_id,
                    stock=stock
                )
                db.session.add(product_size)
        
        # Update colors
        if 'colors' in data:
            # Remove existing colors
            ProductColor.query.filter_by(product_id=product_id).delete()
            
            # Add new colors
            for color_data in data['colors']:
                color_id = color_data.get('color_id')
                
                # Verify color exists
                color = Color.query.get(color_id)
                if not color:
                    return {'error': f'Color {color_id} not found'}, 400
                
                product_color = ProductColor(
                    product_id=product_id,
                    color_id=color_id
                )
                db.session.add(product_color)
        
        # Update materials
        if 'materials' in data:
            # Remove existing materials
            ProductMaterial.query.filter_by(product_id=product_id).delete()
            
            # Add new materials
            for material_data in data['materials']:
                material_id = material_data.get('material_id')
                percentage = material_data.get('percentage', 100)
                
                # Verify material exists
                material = Material.query.get(material_id)
                if not material:
                    return {'error': f'Material {material_id} not found'}, 400
                
                product_material = ProductMaterial(
                    product_id=product_id,
                    material_id=material_id,
                    percentage=percentage
                )
                db.session.add(product_material)
        
        # Update shipping countries
        if 'shipping_countries' in data:
            # Remove existing shipping countries
            ProductShipping.query.filter_by(product_id=product_id).delete()
            
            # Add new shipping countries
            for country_data in data['shipping_countries']:
                country_id = country_data.get('country_id')
                is_available = country_data.get('is_available', True)
                
                # Verify country exists
                country = ShippingCountry.query.get(country_id)
                if not country:
                    return {'error': f'Country {country_id} not found'}, 400
                
                product_shipping = ProductShipping(
                    product_id=product_id,
                    country_id=country_id,
                    is_available=is_available
                )
                db.session.add(product_shipping)
        
        db.session.commit()
        
        return {
            'message': 'Product attributes updated successfully',
            'product': product.to_dict()
        }, 200
    except Exception as e:
        db.session.rollback()
        return {'error': str(e)}, 500


@products_bp.route('/<product_id>/review', methods=['POST'])
@jwt_required()
def add_review(product_id):
    """Add review to product"""
    user_id = get_jwt_identity()
    product = Product.query.get(product_id)
    
    if not product:
        return {'error': 'Product not found'}, 404
    
    data = request.get_json()
    
    if not all(key in data for key in ['rating', 'content']):
        return {'error': 'Missing required fields'}, 400
    
    if not (1 <= data['rating'] <= 5):
        return {'error': 'Rating must be between 1 and 5'}, 400
    
    # Check for existing review
    existing_review = Review.query.filter_by(
        user_id=user_id,
        product_id=product_id
    ).first()
    
    if existing_review:
        return {'error': 'You already reviewed this product'}, 409
    
    try:
        review = Review(
            user_id=user_id,
            product_id=product_id,
            rating=data['rating'],
            title=data.get('title'),
            content=data['content'],
            is_verified_purchase=True  # Set this based on order check
        )
        
        db.session.add(review)
        
        # Update product rating
        all_reviews = Review.query.filter_by(product_id=product_id).all()
        avg_rating = sum(r.rating for r in all_reviews) / len(all_reviews)
        product.rating = round(avg_rating, 1)
        product.review_count = len(all_reviews) + 1
        
        db.session.commit()
        
        return {
            'message': 'Review added successfully',
            'review': review.to_dict()
        }, 201
    except Exception as e:
        db.session.rollback()
        return {'error': str(e)}, 500


# ============================================================================
# CATEGORY ENDPOINTS
# ============================================================================

@products_bp.route('/categories', methods=['GET'])
def get_categories():
    """Get all active categories"""
    categories = Category.query.filter_by(is_active=True).all()
    return {'categories': [c.to_dict() for c in categories]}, 200


@products_bp.route('/categories', methods=['POST'])
@jwt_required()
def create_category():
    """Create new category (seller or admin)"""
    user = User.query.get(get_jwt_identity())
    if not user or user.role not in ['admin', 'seller']:
        return {'error': 'Unauthorized'}, 403
    
    data = request.get_json()
    if not data or 'name' not in data:
        return {'error': 'Missing category name'}, 400
    
    # Check if category already exists
    existing = Category.query.filter_by(name=data['name']).first()
    if existing:
        return {'error': 'Category already exists'}, 409
    
    try:
        category = Category(
            name=data['name'],
            description=data.get('description'),
            image_url=data.get('image_url'),
            is_active=data.get('is_active', True)
        )
        db.session.add(category)
        db.session.commit()
        
        return {
            'message': 'Category created successfully',
            'category': category.to_dict()
        }, 201
    except Exception as e:
        db.session.rollback()
        return {'error': str(e)}, 500


@products_bp.route('/categories/<category_id>', methods=['PUT'])
@jwt_required()
def update_category(category_id):
    """Update category (admin only)"""
    user = User.query.get(get_jwt_identity())
    if not user or user.role != 'admin':
        return {'error': 'Unauthorized'}, 403
    
    category = Category.query.get(category_id)
    if not category:
        return {'error': 'Category not found'}, 404
    
    data = request.get_json()
    
    try:
        if 'name' in data:
            category.name = data['name']
        if 'description' in data:
            category.description = data['description']
        if 'image_url' in data:
            category.image_url = data['image_url']
        if 'is_active' in data:
            category.is_active = data['is_active']
        
        db.session.commit()
        
        return {
            'message': 'Category updated successfully',
            'category': category.to_dict()
        }, 200
    except Exception as e:
        db.session.rollback()
        return {'error': str(e)}, 500


# ============================================================================
# BRAND ENDPOINTS
# ============================================================================

@products_bp.route('/brands', methods=['GET'])
def get_brands():
    """Get all active brands"""
    brands = Brand.query.filter_by(is_active=True).all()
    return {'brands': [b.to_dict() for b in brands]}, 200


@products_bp.route('/brands', methods=['POST'])
@jwt_required()
def create_brand():
    """Create new brand (seller or admin)"""
    user = User.query.get(get_jwt_identity())
    if not user or user.role not in ['admin', 'seller']:
        return {'error': 'Unauthorized'}, 403
    
    data = request.get_json()
    if not data or 'name' not in data:
        return {'error': 'Missing brand name'}, 400
    
    # Check if brand already exists
    existing = Brand.query.filter_by(name=data['name']).first()
    if existing:
        return {'error': 'Brand already exists'}, 409
    
    try:
        brand = Brand(
            name=data['name'],
            description=data.get('description'),
            logo_url=data.get('logo_url'),
            website=data.get('website'),
            is_active=data.get('is_active', True)
        )
        db.session.add(brand)
        db.session.commit()
        
        return {
            'message': 'Brand created successfully',
            'brand': brand.to_dict()
        }, 201
    except Exception as e:
        db.session.rollback()
        return {'error': str(e)}, 500


@products_bp.route('/brands/<brand_id>', methods=['PUT'])
@jwt_required()
def update_brand(brand_id):
    """Update brand (admin only)"""
    user = User.query.get(get_jwt_identity())
    if not user or user.role != 'admin':
        return {'error': 'Unauthorized'}, 403
    
    brand = Brand.query.get(brand_id)
    if not brand:
        return {'error': 'Brand not found'}, 404
    
    data = request.get_json()
    
    try:
        if 'name' in data:
            brand.name = data['name']
        if 'description' in data:
            brand.description = data['description']
        if 'logo_url' in data:
            brand.logo_url = data['logo_url']
        if 'website' in data:
            brand.website = data['website']
        if 'is_active' in data:
            brand.is_active = data['is_active']
        
        db.session.commit()
        
        return {
            'message': 'Brand updated successfully',
            'brand': brand.to_dict()
        }, 200
    except Exception as e:
        db.session.rollback()
        return {'error': str(e)}, 500
