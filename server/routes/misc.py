from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, Store, User

misc_bp = Blueprint('misc', __name__)


@misc_bp.route('/api/stores', methods=['GET'])
@jwt_required()
def get_stores():
    """Get all stores"""
    try:
        user_id = int(get_jwt_identity())
        user = User.query.get(user_id)
        if not user or user.role not in ['manager', 'super_admin']:
            return jsonify({'message': 'Unauthorized'}), 403

        stores = Store.query.all()
        stores_data = [{
            'id': store.id,
            'name': store.name,
            'address': store.address,
            'contact_number': store.contact_number,
            'description': store.description,
            'logo_url': store.logo_url,
        } for store in stores]
        return jsonify({'stores': stores_data}), 200
    except Exception as e:
        return jsonify({'message': str(e)}), 500


@misc_bp.route('/api/system-settings', methods=['GET'])
@jwt_required()
def get_system_settings():
    """Get system settings (stub)"""
    return jsonify({
        'general_settings': {
            'site_name': 'Naqsh Couture',
            'site_description': 'Premium Pakistani Tailoring & Fashion',
            'maintenance_mode': False,
        },
        'email_settings': {
            'smtp_host': '',
            'smtp_port': 587,
            'smtp_user': '',
            'smtp_password': '',
            'from_email': '',
        },
        'security_settings': {
            'session_timeout': 30,
            'max_login_attempts': 5,
            'require_2fa': False,
        },
        'api_settings': {
            'rate_limit': 100,
            'cors_origins': '*',
        },
        'notification_settings': {
            'email_notifications': True,
            'push_notifications': False,
            'order_updates': True,
        },
        'backup_settings': {
            'auto_backup': True,
            'backup_frequency': 'daily',
            'cloud_backup': False,
            'cloud_provider': '',
        },
    }), 200


@misc_bp.route('/api/system-settings', methods=['POST'])
@jwt_required()
def save_system_settings():
    """Save system settings (stub)"""
    try:
        user_id = int(get_jwt_identity())
        user = User.query.get(user_id)
        if not user or user.role != 'super_admin':
            return jsonify({'message': 'Unauthorized'}), 403

        data = request.get_json()
        return jsonify({'message': 'System settings saved successfully'}), 200
    except Exception as e:
        return jsonify({'message': str(e)}), 500


@misc_bp.route('/api/store-config', methods=['GET'])
@jwt_required()
def get_store_config():
    """Get store configuration (stub)"""
    return jsonify({
        'store_settings': {
            'currency': 'PKR',
            'tax_rate': 0,
            'shipping_cost': 0,
            'free_shipping_threshold': 5000,
        },
        'payment_methods': [
            {'id': 1, 'name': 'Cash on Delivery', 'enabled': True},
            {'id': 2, 'name': 'Bank Transfer', 'enabled': True},
        ],
        'shipping_methods': [
            {'id': 1, 'name': 'Standard Shipping', 'cost': 200, 'enabled': True},
            {'id': 2, 'name': 'Express Shipping', 'cost': 500, 'enabled': True},
        ],
    }), 200


@misc_bp.route('/api/store-config', methods=['POST'])
@jwt_required()
def save_store_config():
    """Save store configuration (stub)"""
    try:
        user_id = int(get_jwt_identity())
        user = User.query.get(user_id)
        if not user or user.role != 'super_admin':
            return jsonify({'message': 'Unauthorized'}), 403

        data = request.get_json()
        return jsonify({'message': 'Store configuration saved successfully'}), 200
    except Exception as e:
        return jsonify({'message': str(e)}), 500
