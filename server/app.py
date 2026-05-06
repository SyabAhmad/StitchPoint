"""Flask backend server with PostgreSQL, JWT authentication, and Alembic migrations.

This server provides API endpoints for the React app and serves static files.
"""

from flask import Flask, send_from_directory, jsonify
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager
from flask_cors import CORS
import os

from config import Config
from models import db, CommissionRate
from sqlalchemy.exc import ProgrammingError
from routes.auth import auth_bp
from routes.products import products_bp
from routes.dashboard import dashboard_bp
from routes.categories import categories_bp
from routes.analytics import analytics_bp
from routes.orders import orders_bp
from routes.reviews import reviews_bp
from routes.cart import cart_bp
from routes.wishlist import wishlist_bp
from routes.commission_rates import commission_rates_bp
from routes.notifications import notifications_bp
from routes.commissions import commissions_bp
from logger import setup_logger

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))

app = Flask(__name__, static_folder=ROOT, static_url_path='')
app.config.from_object(Config)

# Initialize extensions
db.init_app(app)
migrate = Migrate(app, db)
jwt = JWTManager(app)
CORS(app, resources={r"/api/*": {"origins": "http://localhost:5173"}, r"/uploads/*": {"origins": "http://localhost:5173"}}, supports_credentials=True)

# Set up logger
logger = setup_logger()


def ensure_default_commission_rates():
	"""Ensure baseline commission rate tiers exist for new deployments."""
	default_rates = [
		{
			'name': 'Low Tier (PKR 0-500)',
			'min_price': 0.0,
			'max_price': 500.0,
			'commission_percentage': 5.0,
		},
		{
			'name': 'Medium Tier (PKR 500-2000)',
			'min_price': 500.0,
			'max_price': 2000.0,
			'commission_percentage': 8.0,
		},
		{
			'name': 'High Tier (PKR 2000+)',
			'min_price': 2000.0,
			'max_price': None,
			'commission_percentage': 10.0,
		},
	]

	created = False
	for rate in default_rates:
		if not CommissionRate.query.filter_by(name=rate['name']).first():
			commission_rate = CommissionRate(
				name=rate['name'],
				min_price=rate['min_price'],
				max_price=rate['max_price'],
				commission_percentage=rate['commission_percentage'],
		)
			db.session.add(commission_rate)
			created = True

	if created:
		db.session.commit()
		logger.info('Default commission rates initialized.')


# JWT error handlers to return consistent JSON messages and helpful logs
@jwt.unauthorized_loader
def custom_unauthorized_response(reason):
	app.logger.warning("JWT unauthorized: %s", reason)
	return jsonify({"msg": reason}), 401


@jwt.invalid_token_loader
def custom_invalid_token(reason):
	app.logger.warning("JWT invalid token: %s", reason)
	# PyJWT may complain about subject types with a 422; return 422 when appropriate
	return jsonify({"msg": reason}), 422


@jwt.expired_token_loader
def custom_expired_token(jwt_header, jwt_payload):
	app.logger.warning("JWT expired token for identity: %s", jwt_payload.get("sub"))
	return jsonify({"msg": "Token has expired"}), 401


@jwt.revoked_token_loader
def custom_revoked_token(jwt_header, jwt_payload):
	app.logger.warning("JWT revoked token for identity: %s", jwt_payload.get("sub"))
	return jsonify({"msg": "Token has been revoked"}), 401

# Register blueprints
app.register_blueprint(auth_bp, url_prefix='/api/auth')
app.register_blueprint(products_bp, url_prefix='/api')
app.register_blueprint(dashboard_bp, url_prefix='/api/dashboard')
app.register_blueprint(categories_bp, url_prefix='/api')
app.register_blueprint(analytics_bp, url_prefix='/api/analytics')
app.register_blueprint(orders_bp, url_prefix='/api/orders')
app.register_blueprint(reviews_bp, url_prefix='/api/reviews')
app.register_blueprint(cart_bp, url_prefix='/api/cart')
app.register_blueprint(wishlist_bp, url_prefix='/api/wishlist')
app.register_blueprint(commission_rates_bp)
app.register_blueprint(notifications_bp)
app.register_blueprint(commissions_bp)

with app.app_context():
	try:
		ensure_default_commission_rates()
	except ProgrammingError:
		pass  # tables not created yet; run flask db upgrade first

@app.route('/uploads/<path:filename>')
def serve_uploaded_file(filename):
	"""Serve uploaded files from the uploads directory."""
	# Prefer project-root uploads folder, but fall back to server/uploads
	project_uploads = os.path.join(ROOT, 'uploads')
	server_uploads = os.path.join(os.path.dirname(__file__), 'uploads')

	# Serve from project root uploads if present
	candidate = os.path.join(project_uploads, filename)
	if os.path.exists(candidate):
		return send_from_directory(project_uploads, filename)

	# Fallback: serve from server/uploads (legacy location)
	candidate = os.path.join(server_uploads, filename)
	if os.path.exists(candidate):
		return send_from_directory(server_uploads, filename)

	# Not found in either location
	return {'error': 'File not found'}, 404

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
	"""Serve a static file if it exists, otherwise return index.html.

	This allows the React SPA to handle client-side routes while still
	enabling direct access to static assets during development.
	"""
	if path != '' and os.path.exists(os.path.join(ROOT, path)):
		return send_from_directory(ROOT, path)
	# Do not serve index.html for API routes
	if path.startswith('api/'):
		return {'error': 'Not found'}, 404
	return send_from_directory(ROOT, 'index.html')


if __name__ == '__main__':
	# Do not enable debug=True in production.
	app.run(host='127.0.0.1', port=5000, debug=True)
