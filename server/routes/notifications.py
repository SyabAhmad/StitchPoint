from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, Notification, User, Order, Product
from datetime import datetime
import json

notifications_bp = Blueprint('notifications', __name__, url_prefix='/api/notifications')

@notifications_bp.route('', methods=['GET'])
@jwt_required()
def get_notifications():
    """Get notifications for the current user"""
    try:
        user_id = int(get_jwt_identity())
        user = User.query.get(user_id)
        
        if not user:
            return jsonify({'message': 'User not found'}), 404
        
        # Get pagination parameters
        page = request.args.get('page', 1, type=int)
        limit = request.args.get('limit', 20, type=int)
        offset = (page - 1) * limit
        
        # For super_admin, get all notifications
        # For others, get their notifications
        if user.role == 'super_admin':
            notifications_query = Notification.query
        else:
            notifications_query = Notification.query.filter(
                db.or_(Notification.user_id == user_id, Notification.user_id.is_(None))
            )
        
        # Get total count
        total_count = notifications_query.count()
        
        # Apply pagination and ordering
        notifications = notifications_query.order_by(
            Notification.created_at.desc()
        ).offset(offset).limit(limit).all()
        
        notifications_data = []
        for notification in notifications:
            try:
                data = json.loads(notification.data) if notification.data else {}
            except:
                data = {}
            
            notifications_data.append({
                'id': notification.id,
                'title': notification.title,
                'message': notification.message,
                'type': notification.type,
                'is_read': notification.is_read,
                'data': data,
                'created_at': notification.created_at.isoformat()
            })
        
        return jsonify({
            'notifications': notifications_data,
            'pagination': {
                'page': page,
                'limit': limit,
                'total': total_count,
                'pages': (total_count + limit - 1) // limit
            }
        }), 200
        
    except Exception as e:
        return jsonify({'message': f'Error fetching notifications: {str(e)}'}), 500

@notifications_bp.route('/unread', methods=['GET'])
@jwt_required()
def get_unread_notifications():
    """Get unread notifications count"""
    try:
        user_id = int(get_jwt_identity())
        user = User.query.get(user_id)
        
        if not user:
            return jsonify({'message': 'User not found'}), 404
        
        # Count unread notifications
        if user.role == 'super_admin':
            unread_count = Notification.query.filter_by(is_read=False).count()
        else:
            unread_count = Notification.query.filter(
                Notification.is_read == False,
                db.or_(Notification.user_id == user_id, Notification.user_id.is_(None))
            ).count()
        
        return jsonify({'unread_count': unread_count}), 200
        
    except Exception as e:
        return jsonify({'message': f'Error fetching unread count: {str(e)}'}), 500

@notifications_bp.route('/<int:notification_id>/read', methods=['PUT'])
@jwt_required()
def mark_notification_read(notification_id):
    """Mark a specific notification as read"""
    try:
        user_id = int(get_jwt_identity())
        user = User.query.get(user_id)
        
        if not user:
            return jsonify({'message': 'User not found'}), 404
        
        notification = Notification.query.get(notification_id)
        if not notification:
            return jsonify({'message': 'Notification not found'}), 404
        
        # Check permission (user can only mark their own notifications or system-wide notifications)
        if user.role != 'super_admin' and notification.user_id != user_id and notification.user_id is not None:
            return jsonify({'message': 'Unauthorized'}), 403
        
        notification.is_read = True
        db.session.commit()
        
        return jsonify({'message': 'Notification marked as read'}), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': f'Error marking notification as read: {str(e)}'}), 500

@notifications_bp.route('/read-all', methods=['PUT'])
@jwt_required()
def mark_all_notifications_read():
    """Mark all notifications as read for the current user"""
    try:
        user_id = int(get_jwt_identity())
        user = User.query.get(user_id)
        
        if not user:
            return jsonify({'message': 'User not found'}), 404
        
        # Mark all notifications as read
        if user.role == 'super_admin':
            Notification.query.filter_by(is_read=False).update({'is_read': True})
        else:
            Notification.query.filter(
                Notification.is_read == False,
                db.or_(Notification.user_id == user_id, Notification.user_id.is_(None))
            ).update({'is_read': True})
        
        db.session.commit()
        
        return jsonify({'message': 'All notifications marked as read'}), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': f'Error marking all notifications as read: {str(e)}'}), 500

@notifications_bp.route('', methods=['POST'])
@jwt_required()
def create_notification():
    """Create a new notification (super admin only)"""
    try:
        user_id = int(get_jwt_identity())
        user = User.query.get(user_id)
        
        if not user or user.role != 'super_admin':
            return jsonify({'message': 'Unauthorized'}), 403
        
        data = request.get_json()
        
        if not data.get('title') or not data.get('message') or not data.get('type'):
            return jsonify({'message': 'Title, message, and type are required'}), 400
        
        target_user_id = data.get('user_id')
        
        # Validate notification type
        valid_types = ['commission_change', 'order_status', 'product', 'system']
        if data['type'] not in valid_types:
            return jsonify({'message': f'Invalid notification type. Must be one of: {", ".join(valid_types)}'}), 400
        
        notification = Notification(
            user_id=target_user_id,  # None for system-wide notifications
            title=data['title'],
            message=data['message'],
            type=data['type'],
            data=json.dumps(data.get('data', {}))
        )
        
        db.session.add(notification)
        db.session.commit()
        
        return jsonify({
            'message': 'Notification created successfully',
            'notification': {
                'id': notification.id,
                'title': notification.title,
                'message': notification.message,
                'type': notification.type,
                'created_at': notification.created_at.isoformat()
            }
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': f'Error creating notification: {str(e)}'}), 500

@notifications_bp.route('/order-status', methods=['POST'])
@jwt_required()
def send_order_status_notification():
    """Send order status change notification"""
    try:
        user_id = int(get_jwt_identity())
        user = User.query.get(user_id)
        
        if not user or user.role not in ['manager', 'super_admin']:
            return jsonify({'message': 'Unauthorized'}), 403
        
        data = request.get_json()
        
        order_id = data.get('order_id')
        status = data.get('status')
        
        if not order_id or not status:
            return jsonify({'message': 'Order ID and status are required'}), 400
        
        order = Order.query.get(order_id)
        if not order:
            return jsonify({'message': 'Order not found'}), 404
        
        # Status mapping for user-friendly messages
        status_messages = {
            'processing': 'Your order is being processed',
            'shipped': 'Your order has been shipped',
            'delivered': 'Your order has been delivered',
            'cancelled': 'Your order has been cancelled'
        }
        
        message = status_messages.get(status, f'Order status updated to: {status}')
        
        # Send notification to customer
        create_notification_record(
            user_id=order.user_id,
            title=f'Order #{order_id} - {status.title()}',
            message=message,
            type='order_status',
            data={'order_id': order_id, 'status': status}
        )
        
        return jsonify({'message': 'Order status notification sent'}), 200
        
    except Exception as e:
        return jsonify({'message': f'Error sending order status notification: {str(e)}'}), 500

@notifications_bp.route('/product', methods=['POST'])
@jwt_required()
def send_product_notification():
    """Send product-related notification"""
    try:
        user_id = int(get_jwt_identity())
        user = User.query.get(user_id)
        
        if not user or user.role not in ['manager', 'super_admin']:
            return jsonify({'message': 'Unauthorized'}), 403
        
        data = request.get_json()
        
        product_id = data.get('product_id')
        action = data.get('action')
        
        if not product_id or not action:
            return jsonify({'message': 'Product ID and action are required'}), 400
        
        product = Product.query.get(product_id)
        if not product:
            return jsonify({'message': 'Product not found'}), 404
        
        # Action mapping for user-friendly messages
        action_messages = {
            'added': f'New product "{product.name}" has been added to the store',
            'updated': f'Product "{product.name}" has been updated',
            'out_of_stock': f'Product "{product.name}" is now out of stock',
            'in_stock': f'Product "{product.name}" is back in stock'
        }
        
        message = action_messages.get(action, f'Product "{product.name}" has been {action}')
        
        # Get store managers
        store_managers = User.query.filter_by(role='manager', store_id=product.store_id).all()
        
        # Send notification to store managers
        for manager in store_managers:
            create_notification_record(
                user_id=manager.id,
                title=f'Product Update - {action.title()}',
                message=message,
                type='product',
                data={'product_id': product_id, 'action': action}
            )
        
        return jsonify({'message': 'Product notification sent'}), 200
        
    except Exception as e:
        return jsonify({'message': f'Error sending product notification: {str(e)}'}), 500

def create_notification_record(user_id, title, message, notification_type, data=None):
    """Helper function to create a notification record"""
    try:
        notification = Notification(
            user_id=user_id,
            title=title,
            message=message,
            type=notification_type,
            data=json.dumps(data or {})
        )
        db.session.add(notification)
        db.session.commit()
        return notification
    except Exception as e:
        print(f"Error creating notification: {e}")
        db.session.rollback()
        return None

def send_system_notification(title, message, notification_type='system', data=None):
    """Send system-wide notification to all users"""
    try:
        # Get all active users
        users = User.query.filter(User.role.in_(['customer', 'manager'])).all()
        
        for user in users:
            create_notification_record(
                user_id=user.id,
                title=title,
                message=message,
                notification_type=notification_type,
                data=data
            )
    except Exception as e:
        print(f"Error sending system notification: {e}")