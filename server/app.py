import os
from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from dotenv import load_dotenv
from config import CONFIG
from db import db, migrate, init_db

load_dotenv()

def create_app(config=None):
    """Application factory"""
    app = Flask(__name__)
    
    # Config
    if config is None:
        config = CONFIG
    app.config.from_object(config)
    
    # CORS
    CORS(app, resources={
        r"/api/*": {
            "origins": ["http://localhost:5173", "http://localhost:3000"],
            "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
            "allow_headers": ["Content-Type", "Authorization"]
        }
    })
    
    # JWT
    jwt = JWTManager(app)
    
    # Database
    init_db(app)
    
    # Health check
    @app.route('/api/health', methods=['GET'])
    def health():
        return {'status': 'healthy', 'service': 'StitchPoint Backend'}, 200
    
    # Import and register blueprints
    from auth.routes import auth_bp
    from products.routes import products_bp
    from orders.routes import orders_bp
    from users.routes import users_bp
    from seller.routes import seller_bp
    
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(products_bp, url_prefix='/api/products')
    app.register_blueprint(orders_bp, url_prefix='/api/orders')
    app.register_blueprint(users_bp, url_prefix='/api/users')
    app.register_blueprint(seller_bp, url_prefix='/api/seller')
    
    # Error handlers
    @app.errorhandler(404)
    def not_found(error):
        return {'error': 'Resource not found'}, 404
    
    @app.errorhandler(500)
    def internal_error(error):
        db.session.rollback()
        return {'error': 'Internal server error'}, 500
    
    return app

# Create app instance
app = create_app()

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
