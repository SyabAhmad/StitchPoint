"""Flask backend server with PostgreSQL, JWT authentication, and Alembic migrations.

This server provides API endpoints for the React app and serves static files.
"""

from flask import Flask, send_from_directory, jsonify
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager
from flask_cors import CORS
import os

from config import Config
from models import db
from routes.auth import auth_bp
from routes.products import products_bp
from routes.dashboard import dashboard_bp
from routes.categories import categories_bp
from routes.analytics import analytics_bp
from routes.orders import orders_bp
from logger import setup_logger

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))

app = Flask(__name__, static_folder=ROOT, static_url_path='')
app.config.from_object(Config)

# Initialize extensions
db.init_app(app)
migrate = Migrate(app, db)
jwt = JWTManager(app)
CORS(app)

# Set up logger
logger = setup_logger()


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
