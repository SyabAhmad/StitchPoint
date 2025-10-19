from db import db
from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash
import enum
import uuid


class User(db.Model):
    """User model for authentication"""
    __tablename__ = "users"

    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    username = db.Column(db.String(80), unique=True, nullable=False, index=True)
    email = db.Column(db.String(120), unique=True, nullable=False, index=True)
    password_hash = db.Column(db.String(255), nullable=False)
    first_name = db.Column(db.String(120))
    last_name = db.Column(db.String(120))
    phone = db.Column(db.String(20))
    avatar_url = db.Column(db.String(500))
    is_active = db.Column(db.Boolean, default=True)
    is_verified = db.Column(db.Boolean, default=False)
    role = db.Column(db.String(20), default="customer")  # customer, seller, admin
    
    # Store information (for sellers)
    store_name = db.Column(db.String(200))
    store_description = db.Column(db.Text)
    store_logo = db.Column(db.Text)  # Base64 encoded image or URL
    store_banner = db.Column(db.Text)  # Base64 encoded image or URL
    
    created_at = db.Column(db.DateTime, default=datetime.utcnow, index=True)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    orders = db.relationship("Order", back_populates="user", foreign_keys="Order.user_id", cascade="all, delete-orphan")
    reviews = db.relationship("Review", back_populates="user", cascade="all, delete-orphan")
    seller_products = db.relationship("Product", back_populates="seller", cascade="all, delete-orphan")

    def set_password(self, password):
        """Hash and set password"""
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        """Verify password"""
        return check_password_hash(self.password_hash, password)

    def to_dict(self):
        """Convert to dictionary"""
        return {
            "id": self.id,
            "username": self.username,
            "email": self.email,
            "first_name": self.first_name,
            "last_name": self.last_name,
            "phone": self.phone,
            "avatar_url": self.avatar_url,
            "is_active": self.is_active,
            "is_verified": self.is_verified,
            "role": self.role,
            "store_name": self.store_name,
            "store_description": self.store_description,
            "store_logo": self.store_logo,
            "store_banner": self.store_banner,
            "created_at": self.created_at.isoformat(),
        }

    def __repr__(self):
        return f"<User {self.username}>"


class Product(db.Model):
    """Product model"""
    __tablename__ = "products"

    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    title = db.Column(db.String(255), nullable=False, index=True)
    description = db.Column(db.Text)
    price = db.Column(db.Float, nullable=False)
    discount_percent = db.Column(db.Float, default=0)
    stock = db.Column(db.Integer, default=0)
    image_url = db.Column(db.Text)  # Changed from String(500) to Text for base64 images
    rating = db.Column(db.Float, default=0)
    review_count = db.Column(db.Integer, default=0)
    is_active = db.Column(db.Boolean, default=True)
    
    # Sales & Analytics Tracking
    total_sold = db.Column(db.Integer, default=0)  # Total units sold
    monthly_revenue = db.Column(db.Float, default=0)  # Revenue this month
    last_sale_date = db.Column(db.DateTime, nullable=True)  # Last sale timestamp
    
    # Foreign Keys
    seller_id = db.Column(db.String(36), db.ForeignKey("users.id"), nullable=False, index=True)
    category_id = db.Column(db.String(36), db.ForeignKey("categories.id"), nullable=True, index=True)
    brand_id = db.Column(db.String(36), db.ForeignKey("brands.id"), nullable=True, index=True)
    
    # Timestamps
    created_at = db.Column(db.DateTime, default=datetime.utcnow, index=True)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    seller = db.relationship("User", back_populates="seller_products")
    category = db.relationship("Category")
    brand = db.relationship("Brand")
    order_items = db.relationship("OrderItem", back_populates="product", cascade="all, delete-orphan")
    reviews = db.relationship("Review", back_populates="product", cascade="all, delete-orphan")
    available_sizes = db.relationship("ProductSize", back_populates="product", cascade="all, delete-orphan")
    available_colors = db.relationship("ProductColor", back_populates="product", cascade="all, delete-orphan")
    materials = db.relationship("ProductMaterial", back_populates="product", cascade="all, delete-orphan")
    shipping_countries = db.relationship("ProductShipping", back_populates="product", cascade="all, delete-orphan")

    @property
    def final_price(self):
        """Calculate final price after discount"""
        if self.discount_percent > 0:
            return self.price * (1 - self.discount_percent / 100)
        return self.price

    def to_dict(self):
        """Convert to dictionary"""
        return {
            "id": self.id,
            "title": self.title,
            "description": self.description,
            "price": self.price,
            "discount_percent": self.discount_percent,
            "final_price": self.final_price,
            "stock": self.stock,
            "category": self.category.to_dict() if self.category else None,
            "category_id": self.category_id,
            "brand": self.brand.to_dict() if self.brand else None,
            "brand_id": self.brand_id,
            "image_url": self.image_url,
            "rating": self.rating,
            "review_count": self.review_count,
            "sizes": [ps.to_dict() for ps in self.available_sizes],
            "colors": [pc.to_dict() for pc in self.available_colors],
            "materials": [pm.to_dict() for pm in self.materials],
            "shipping_countries": [ps.to_dict() for ps in self.shipping_countries],
            "seller": self.seller.to_dict(),
            "created_at": self.created_at.isoformat(),
        }

    def __repr__(self):
        return f"<Product {self.title}>"


class Order(db.Model):
    """Order model"""
    __tablename__ = "orders"

    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    order_number = db.Column(db.String(20), unique=True, nullable=False, index=True)
    status = db.Column(db.String(20), default="pending")  # pending, confirmed, shipped, delivered, cancelled
    total_amount = db.Column(db.Float, nullable=False)
    shipping_address = db.Column(db.Text)
    tracking_number = db.Column(db.String(100))
    notes = db.Column(db.Text)
    
    # Payment Information
    payment_status = db.Column(db.String(20), default="pending")  # pending, completed, failed, refunded
    payment_method = db.Column(db.String(50))  # credit_card, paypal, etc
    refund_amount = db.Column(db.Float, default=0)
    
    # Seller Revenue Tracking
    commission_fee = db.Column(db.Float, default=0)  # Platform commission
    seller_payout = db.Column(db.Float, nullable=True)  # Amount seller receives
    
    # Customer Rating & Review
    rating_by_customer = db.Column(db.Integer, nullable=True)  # 1-5 stars for the order
    customer_review = db.Column(db.Text, nullable=True)  # Customer review comment
    
    # Foreign Keys
    user_id = db.Column(db.String(36), db.ForeignKey("users.id"), nullable=False, index=True)
    seller_id = db.Column(db.String(36), db.ForeignKey("users.id"), nullable=True, index=True)  # Track seller
    
    # Timestamps
    created_at = db.Column(db.DateTime, default=datetime.utcnow, index=True)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    shipped_at = db.Column(db.DateTime)
    delivered_at = db.Column(db.DateTime)

    # Relationships
    user = db.relationship("User", back_populates="orders", foreign_keys=[user_id])
    seller = db.relationship("User", foreign_keys=[seller_id])
    items = db.relationship("OrderItem", back_populates="order", cascade="all, delete-orphan")

    def to_dict(self):
        """Convert to dictionary"""
        return {
            "id": self.id,
            "order_number": self.order_number,
            "status": self.status,
            "total_amount": self.total_amount,
            "shipping_address": self.shipping_address,
            "tracking_number": self.tracking_number,
            "items": [item.to_dict() for item in self.items],
            "created_at": self.created_at.isoformat(),
            "updated_at": self.updated_at.isoformat(),
        }

    def __repr__(self):
        return f"<Order {self.order_number}>"


class OrderItem(db.Model):
    """Order Items model (junction table)"""
    __tablename__ = "order_items"

    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    quantity = db.Column(db.Integer, nullable=False)
    price_at_purchase = db.Column(db.Float, nullable=False)
    
    # Foreign Keys
    order_id = db.Column(db.String(36), db.ForeignKey("orders.id"), nullable=False, index=True)
    product_id = db.Column(db.String(36), db.ForeignKey("products.id"), nullable=False, index=True)

    # Relationships
    order = db.relationship("Order", back_populates="items")
    product = db.relationship("Product", back_populates="order_items")

    def to_dict(self):
        """Convert to dictionary"""
        return {
            "id": self.id,
            "quantity": self.quantity,
            "price_at_purchase": self.price_at_purchase,
            "subtotal": self.quantity * self.price_at_purchase,
            "product": self.product.to_dict(),
        }

    def __repr__(self):
        return f"<OrderItem {self.product.title} x{self.quantity}>"


class Review(db.Model):
    """Product Review model"""
    __tablename__ = "reviews"

    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    rating = db.Column(db.Integer, nullable=False)  # 1-5
    title = db.Column(db.String(255))
    content = db.Column(db.Text)
    is_verified_purchase = db.Column(db.Boolean, default=False)
    helpful_count = db.Column(db.Integer, default=0)
    
    # Foreign Keys
    user_id = db.Column(db.String(36), db.ForeignKey("users.id"), nullable=False, index=True)
    product_id = db.Column(db.String(36), db.ForeignKey("products.id"), nullable=False, index=True)
    
    # Timestamps
    created_at = db.Column(db.DateTime, default=datetime.utcnow, index=True)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    user = db.relationship("User", back_populates="reviews")
    product = db.relationship("Product", back_populates="reviews")

    def to_dict(self):
        """Convert to dictionary"""
        return {
            "id": self.id,
            "rating": self.rating,
            "title": self.title,
            "content": self.content,
            "is_verified_purchase": self.is_verified_purchase,
            "helpful_count": self.helpful_count,
            "user": self.user.to_dict(),
            "created_at": self.created_at.isoformat(),
        }

    def __repr__(self):
        return f"<Review {self.product.title} - {self.rating}★>"


class Cart(db.Model):
    """Shopping Cart model"""
    __tablename__ = "carts"

    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = db.Column(db.String(36), db.ForeignKey("users.id"), nullable=False, unique=True, index=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    items = db.relationship("CartItem", back_populates="cart", cascade="all, delete-orphan")

    def __repr__(self):
        return f"<Cart {self.user_id}>"


class CartItem(db.Model):
    """Cart Items model"""
    __tablename__ = "cart_items"

    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    quantity = db.Column(db.Integer, nullable=False)
    
    # Foreign Keys
    cart_id = db.Column(db.String(36), db.ForeignKey("carts.id"), nullable=False, index=True)
    product_id = db.Column(db.String(36), db.ForeignKey("products.id"), nullable=False, index=True)

    # Relationships
    cart = db.relationship("Cart", back_populates="items")
    product = db.relationship("Product")

    def to_dict(self):
        """Convert to dictionary"""
        return {
            "id": self.id,
            "quantity": self.quantity,
            "product": self.product.to_dict(),
        }

    def __repr__(self):
        return f"<CartItem {self.product.title} x{self.quantity}>"


# ============================================================================
# PRODUCT ATTRIBUTE MODELS (For Product Customization)
# ============================================================================

class Size(db.Model):
    """Product sizes"""
    __tablename__ = "sizes"

    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    name = db.Column(db.String(50), unique=True, nullable=False, index=True)
    description = db.Column(db.String(200))
    
    # Relationships
    product_sizes = db.relationship("ProductSize", back_populates="size", cascade="all, delete-orphan")
    
    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "description": self.description,
        }
    
    def __repr__(self):
        return f"<Size {self.name}>"


class Color(db.Model):
    """Product colors"""
    __tablename__ = "colors"

    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    name = db.Column(db.String(50), unique=True, nullable=False, index=True)
    hex_code = db.Column(db.String(7))  # e.g., #D4AF37
    
    # Relationships
    product_colors = db.relationship("ProductColor", back_populates="color", cascade="all, delete-orphan")
    
    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "hex_code": self.hex_code,
        }
    
    def __repr__(self):
        return f"<Color {self.name}>"


class Material(db.Model):
    """Product materials"""
    __tablename__ = "materials"

    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    name = db.Column(db.String(50), unique=True, nullable=False, index=True)
    description = db.Column(db.String(200))
    
    # Relationships
    product_materials = db.relationship("ProductMaterial", back_populates="material", cascade="all, delete-orphan")
    
    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "description": self.description,
        }
    
    def __repr__(self):
        return f"<Material {self.name}>"


class ShippingCountry(db.Model):
    """Countries where products can be shipped"""
    __tablename__ = "shipping_countries"

    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    name = db.Column(db.String(100), unique=True, nullable=False, index=True)
    country_code = db.Column(db.String(2), unique=True)  # ISO code
    shipping_cost = db.Column(db.Float, default=0)
    estimated_days = db.Column(db.Integer, default=7)
    is_active = db.Column(db.Boolean, default=True)
    
    # Relationships
    product_shipping = db.relationship("ProductShipping", back_populates="country", cascade="all, delete-orphan")
    
    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "country_code": self.country_code,
            "shipping_cost": self.shipping_cost,
            "estimated_days": self.estimated_days,
        }
    
    def __repr__(self):
        return f"<ShippingCountry {self.name}>"


# ============================================================================
# JUNCTION TABLES (Many-to-Many Relationships)
# ============================================================================

class ProductSize(db.Model):
    """Junction table: Products and Sizes"""
    __tablename__ = "product_sizes"

    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    product_id = db.Column(db.String(36), db.ForeignKey("products.id"), nullable=False, index=True)
    size_id = db.Column(db.String(36), db.ForeignKey("sizes.id"), nullable=False, index=True)
    stock = db.Column(db.Integer, default=0)
    
    # Relationships
    product = db.relationship("Product", back_populates="available_sizes")
    size = db.relationship("Size", back_populates="product_sizes")
    
    __table_args__ = (db.UniqueConstraint('product_id', 'size_id', name='_product_size_uc'),)
    
    def to_dict(self):
        return {
            "id": self.id,
            "size": self.size.to_dict(),
            "stock": self.stock,
        }
    
    def __repr__(self):
        return f"<ProductSize {self.product_id} - {self.size.name}>"


class ProductColor(db.Model):
    """Junction table: Products and Colors"""
    __tablename__ = "product_colors"

    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    product_id = db.Column(db.String(36), db.ForeignKey("products.id"), nullable=False, index=True)
    color_id = db.Column(db.String(36), db.ForeignKey("colors.id"), nullable=False, index=True)
    
    # Relationships
    product = db.relationship("Product", back_populates="available_colors")
    color = db.relationship("Color", back_populates="product_colors")
    
    __table_args__ = (db.UniqueConstraint('product_id', 'color_id', name='_product_color_uc'),)
    
    def to_dict(self):
        return {
            "id": self.id,
            "color": self.color.to_dict(),
        }
    
    def __repr__(self):
        return f"<ProductColor {self.product_id} - {self.color.name}>"


class ProductMaterial(db.Model):
    """Junction table: Products and Materials"""
    __tablename__ = "product_materials"

    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    product_id = db.Column(db.String(36), db.ForeignKey("products.id"), nullable=False, index=True)
    material_id = db.Column(db.String(36), db.ForeignKey("materials.id"), nullable=False, index=True)
    percentage = db.Column(db.Float, default=100)  # Composition percentage
    
    # Relationships
    product = db.relationship("Product", back_populates="materials")
    material = db.relationship("Material", back_populates="product_materials")
    
    __table_args__ = (db.UniqueConstraint('product_id', 'material_id', name='_product_material_uc'),)
    
    def to_dict(self):
        return {
            "id": self.id,
            "material": self.material.to_dict(),
            "percentage": self.percentage,
        }
    
    def __repr__(self):
        return f"<ProductMaterial {self.product_id} - {self.material.name}>"


class ProductShipping(db.Model):
    """Junction table: Products and Shipping Countries"""
    __tablename__ = "product_shipping"

    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    product_id = db.Column(db.String(36), db.ForeignKey("products.id"), nullable=False, index=True)
    country_id = db.Column(db.String(36), db.ForeignKey("shipping_countries.id"), nullable=False, index=True)
    is_available = db.Column(db.Boolean, default=True)
    
    # Relationships
    product = db.relationship("Product", back_populates="shipping_countries")
    country = db.relationship("ShippingCountry", back_populates="product_shipping")
    
    __table_args__ = (db.UniqueConstraint('product_id', 'country_id', name='_product_shipping_uc'),)
    
    def to_dict(self):
        return {
            "id": self.id,
            "country": self.country.to_dict(),
            "is_available": self.is_available,
        }
    
    def __repr__(self):
        return f"<ProductShipping {self.product_id} - {self.country.name}>"


# ============================================================================
# SELLER ANALYTICS MODELS
# ============================================================================

class SellerStats(db.Model):
    """Seller statistics and analytics"""
    __tablename__ = "seller_stats"

    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    
    # Foreign Key
    seller_id = db.Column(db.String(36), db.ForeignKey("users.id"), nullable=False, unique=True, index=True)
    
    # Revenue Metrics
    total_revenue = db.Column(db.Float, default=0)  # Lifetime revenue
    monthly_revenue = db.Column(db.Float, default=0)  # Current month revenue
    total_payout = db.Column(db.Float, default=0)  # Total payouts to seller
    pending_payout = db.Column(db.Float, default=0)  # Pending payout amount
    total_commission = db.Column(db.Float, default=0)  # Total commissions paid
    
    # Order Metrics
    total_orders = db.Column(db.Integer, default=0)  # Total orders sold
    completed_orders = db.Column(db.Integer, default=0)  # Completed orders
    cancelled_orders = db.Column(db.Integer, default=0)  # Cancelled orders
    returned_orders = db.Column(db.Integer, default=0)  # Returned orders
    
    # Product Metrics
    total_products = db.Column(db.Integer, default=0)  # Total products uploaded
    active_products = db.Column(db.Integer, default=0)  # Currently active products
    total_items_sold = db.Column(db.Integer, default=0)  # Total units sold
    
    # Rating Metrics
    average_rating = db.Column(db.Float, default=0)  # Average order rating (1-5)
    total_reviews = db.Column(db.Integer, default=0)  # Total reviews/ratings
    
    # Performance Metrics
    response_time_hours = db.Column(db.Float, default=0)  # Avg response time in hours
    cancellation_rate = db.Column(db.Float, default=0)  # Cancellation rate percentage
    return_rate = db.Column(db.Float, default=0)  # Return rate percentage
    positive_feedback_rate = db.Column(db.Float, default=100)  # Positive feedback %
    
    # Timestamps
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    last_sale_at = db.Column(db.DateTime, nullable=True)
    
    # Relationships
    seller = db.relationship("User", foreign_keys=[seller_id])
    
    def to_dict(self):
        return {
            "id": self.id,
            "seller_id": self.seller_id,
            "total_revenue": self.total_revenue,
            "monthly_revenue": self.monthly_revenue,
            "total_orders": self.total_orders,
            "completed_orders": self.completed_orders,
            "cancelled_orders": self.cancelled_orders,
            "returned_orders": self.returned_orders,
            "total_products": self.total_products,
            "active_products": self.active_products,
            "total_items_sold": self.total_items_sold,
            "average_rating": self.average_rating,
            "total_reviews": self.total_reviews,
            "response_time_hours": self.response_time_hours,
            "cancellation_rate": self.cancellation_rate,
            "return_rate": self.return_rate,
            "positive_feedback_rate": self.positive_feedback_rate,
            "last_sale_at": self.last_sale_at.isoformat() if self.last_sale_at else None,
            "updated_at": self.updated_at.isoformat(),
        }
    
    def __repr__(self):
        return f"<SellerStats {self.seller_id}>"


class InventoryLog(db.Model):
    """Inventory change log for tracking stock changes"""
    __tablename__ = "inventory_logs"

    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    
    # Foreign Key
    product_id = db.Column(db.String(36), db.ForeignKey("products.id"), nullable=False, index=True)
    
    # Inventory Changes
    quantity_change = db.Column(db.Integer, nullable=False)  # Positive or negative
    previous_stock = db.Column(db.Integer)  # Stock before change
    new_stock = db.Column(db.Integer)  # Stock after change
    
    # Action Type
    action_type = db.Column(db.String(50), nullable=False)  # 'added', 'sold', 'returned', 'adjusted', 'damaged'
    reference_id = db.Column(db.String(36), nullable=True)  # Order ID or reference
    notes = db.Column(db.Text)
    
    # Timestamp
    created_at = db.Column(db.DateTime, default=datetime.utcnow, index=True)
    
    # Relationships
    product = db.relationship("Product")
    
    def to_dict(self):
        return {
            "id": self.id,
            "product_id": self.product_id,
            "quantity_change": self.quantity_change,
            "previous_stock": self.previous_stock,
            "new_stock": self.new_stock,
            "action_type": self.action_type,
            "reference_id": self.reference_id,
            "notes": self.notes,
            "created_at": self.created_at.isoformat(),
        }
    
    def __repr__(self):
        return f"<InventoryLog {self.product_id} - {self.action_type}>"


class Category(db.Model):
    """Product Category model"""
    __tablename__ = "categories"
    
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    name = db.Column(db.String(100), unique=True, nullable=False, index=True)
    description = db.Column(db.Text)
    image_url = db.Column(db.String(500))
    is_active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "description": self.description,
            "image_url": self.image_url,
            "is_active": self.is_active,
        }
    
    def __repr__(self):
        return f"<Category {self.name}>"


class Brand(db.Model):
    """Product Brand model"""
    __tablename__ = "brands"
    
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    name = db.Column(db.String(100), unique=True, nullable=False, index=True)
    description = db.Column(db.Text)
    logo_url = db.Column(db.String(500))
    website = db.Column(db.String(255))
    is_active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "description": self.description,
            "logo_url": self.logo_url,
            "website": self.website,
            "is_active": self.is_active,
        }
    
    def __repr__(self):
        return f"<Brand {self.name}>"

