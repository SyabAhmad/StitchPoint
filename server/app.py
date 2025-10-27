"""Flask backend server with PostgreSQL, JWT authentication, and Alembic migrations.

This server provides API endpoints for the React app and serves static files.
"""

from flask import Flask, send_from_directory
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager
from flask_cors import CORS
import os

from config import Config
from models import db
from routes.auth import auth_bp
from routes.products import products_bp

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))

app = Flask(__name__, static_folder=ROOT, static_url_path='')
app.config.from_object(Config)

# Initialize extensions
db.init_app(app)
migrate = Migrate(app, db)
jwt = JWTManager(app)
CORS(app)

# Register blueprints
app.register_blueprint(auth_bp, url_prefix='/api/auth')
app.register_blueprint(products_bp, url_prefix='/api')

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
