from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()

class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(256), nullable=False)
    name = db.Column(db.String(100), nullable=True)
    role = db.Column(db.String(20), default='customer')
    profile_picture = db.Column(db.String(500), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # Relationships
    carts = db.relationship('Cart', backref='user', lazy=True)
    wishlists = db.relationship('Wishlist', backref='user', lazy=True)
    orders = db.relationship('Order', backref='user', lazy=True)
    page_views = db.relationship('PageView', backref='user', lazy=True)
    button_clicks = db.relationship('ButtonClick', backref='user', lazy=True)
    store = db.relationship('Store', backref='manager', uselist=False, lazy=True)
    addresses = db.relationship('Address', backref='user', lazy=True)
    payment_methods = db.relationship('PaymentMethod', backref='user', lazy=True)

    def __repr__(self):
        return f'<User {self.email}>'

class Store(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(200), nullable=False)
    address = db.Column(db.Text, nullable=True)
    logo_url = db.Column(db.String(500), nullable=True)
    contact_number = db.Column(db.String(20), nullable=True)
    description = db.Column(db.Text, nullable=True)
    manager_id = db.Column(db.Integer, db.ForeignKey('users.id'), unique=True, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    products = db.relationship('Product', backref='store', lazy=True)
    orders = db.relationship('Order', backref='store', lazy=True)

    def __repr__(self):
        return f'<Store {self.name}>'

class Product(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text, nullable=True)
    price = db.Column(db.Float, nullable=False)
    stock_quantity = db.Column(db.Integer, default=0)
    image_url = db.Column(db.String(500), nullable=True)
    category = db.Column(db.String(100), nullable=True)
    store_id = db.Column(db.Integer, db.ForeignKey('store.id'), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    cart_items = db.relationship('CartItem', backref='product', lazy=True)
    wishlist_items = db.relationship('WishlistItem', backref='product', lazy=True)
    order_items = db.relationship('OrderItem', backref='product', lazy=True)
    reviews = db.relationship('Review', backref='product', lazy=True)

    def __repr__(self):
        return f'<Product {self.name}>'

class Cart(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    items = db.relationship('CartItem', backref='cart', lazy=True)

    def __repr__(self):
        return f'<Cart {self.id}>'

class CartItem(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    cart_id = db.Column(db.Integer, db.ForeignKey('cart.id'), nullable=False)
    product_id = db.Column(db.Integer, db.ForeignKey('product.id'), nullable=False)
    quantity = db.Column(db.Integer, default=1)
    added_at = db.Column(db.DateTime, default=datetime.utcnow)

    def __repr__(self):
        return f'<CartItem {self.id}>'

class Wishlist(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    name = db.Column(db.String(100), default='My Wishlist')
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # Relationships
    items = db.relationship('WishlistItem', backref='wishlist', lazy=True)

    def __repr__(self):
        return f'<Wishlist {self.name}>'

class WishlistItem(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    wishlist_id = db.Column(db.Integer, db.ForeignKey('wishlist.id'), nullable=False)
    product_id = db.Column(db.Integer, db.ForeignKey('product.id'), nullable=False)
    added_at = db.Column(db.DateTime, default=datetime.utcnow)

    def __repr__(self):
        return f'<WishlistItem {self.id}>'

class Order(db.Model):
    __tablename__ = 'orders'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    store_id = db.Column(db.Integer, db.ForeignKey('store.id'), nullable=False)
    total_amount = db.Column(db.Float, nullable=False)
    status = db.Column(db.String(50), default='pending')
    shipping_address = db.Column(db.Text, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    items = db.relationship('OrderItem', backref='order', lazy=True)
    payment = db.relationship('Payment', backref='order', uselist=False, lazy=True)

    def __repr__(self):
        return f'<Order {self.id}>'

class OrderItem(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    order_id = db.Column(db.Integer, db.ForeignKey('orders.id'), nullable=False)
    product_id = db.Column(db.Integer, db.ForeignKey('product.id'), nullable=False)
    quantity = db.Column(db.Integer, nullable=False)
    price = db.Column(db.Float, nullable=False)

    def __repr__(self):
        return f'<OrderItem {self.id}>'

class Payment(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    order_id = db.Column(db.Integer, db.ForeignKey('orders.id'), nullable=False)
    amount = db.Column(db.Float, nullable=False)
    payment_method = db.Column(db.String(50), nullable=False)
    transaction_id = db.Column(db.String(200), nullable=True)
    status = db.Column(db.String(50), default='pending')
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def __repr__(self):
        return f'<Payment {self.id}>'

class PageView(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=True)
    page_url = db.Column(db.String(500), nullable=False)
    referrer = db.Column(db.String(500), nullable=True)
    user_agent = db.Column(db.Text, nullable=True)
    ip_address = db.Column(db.String(45), nullable=True)
    viewed_at = db.Column(db.DateTime, default=datetime.utcnow)

    def __repr__(self):
        return f'<PageView {self.page_url}>'

class Category(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False, unique=True)
    description = db.Column(db.Text, nullable=True)
    parent_id = db.Column(db.Integer, db.ForeignKey('category.id'), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    parent = db.relationship('Category', remote_side=[id], backref=db.backref('subcategories', lazy=True))

    def __repr__(self):
        return f'<Category {self.name}>'

class ButtonClick(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=True)
    button_name = db.Column(db.String(100), nullable=False)
    page_url = db.Column(db.String(500), nullable=False)
    element_id = db.Column(db.String(100), nullable=True)
    clicked_at = db.Column(db.DateTime, default=datetime.utcnow)

    def __repr__(self):
        return f'<ButtonClick {self.button_name}>'


class Review(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    product_id = db.Column(db.Integer, db.ForeignKey('product.id'), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=True)
    user_name = db.Column(db.String(120), nullable=True)
    rating = db.Column(db.Integer, nullable=False, default=5)
    comment = db.Column(db.Text, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def __repr__(self):
        return f'<Review {self.id} for product {self.product_id}>'

class Comment(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    product_id = db.Column(db.Integer, db.ForeignKey('product.id'), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=True)
    user_name = db.Column(db.String(120), nullable=True)
    comment = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def __repr__(self):
        return f'<Comment {self.id} for product {self.product_id}>'

class ProductAnalytics(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    product_id = db.Column(db.Integer, db.ForeignKey('product.id'), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=True)
    action = db.Column(db.String(50), nullable=False)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)
    time_spent = db.Column(db.Float, nullable=True)
    referrer = db.Column(db.String(500), nullable=True)
    user_agent = db.Column(db.Text, nullable=True)

    # Relationships
    product = db.relationship('Product', backref='analytics', lazy=True)

    def __repr__(self):
        return f'<ProductAnalytics {self.action} on product {self.product_id}>'

class Address(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    name = db.Column(db.String(100), nullable=False)  # e.g., "Home", "Work"
    street_address = db.Column(db.Text, nullable=False)
    city = db.Column(db.String(100), nullable=False)
    state = db.Column(db.String(100), nullable=False)
    postal_code = db.Column(db.String(20), nullable=False)
    country = db.Column(db.String(100), nullable=False)
    is_default = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def __repr__(self):
        return f'<Address {self.name} for user {self.user_id}>'

class PaymentMethod(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    cardholder_name = db.Column(db.String(100), nullable=False)
    card_number_last_four = db.Column(db.String(4), nullable=False)  # Store only last 4 digits
    card_type = db.Column(db.String(50), nullable=False)  # e.g., "Visa", "MasterCard"
    expiry_month = db.Column(db.Integer, nullable=False)
    expiry_year = db.Column(db.Integer, nullable=False)
    is_default = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def __repr__(self):
        return f'<PaymentMethod {self.card_type} ****{self.card_number_last_four} for user {self.user_id}>'
