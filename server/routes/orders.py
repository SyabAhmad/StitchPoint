from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from datetime import datetime
from models import db, Order, OrderItem, Address, PaymentMethod, User, Product, Payment
import logging

orders_bp = Blueprint('orders', __name__, url_prefix='/api/orders')
logger = logging.getLogger(__name__)

@orders_bp.route('', methods=['POST'])
@jwt_required()
def create_order():
    """Create orders for items, grouped by store"""
    try:
        user_id = get_jwt_identity()
        data = request.get_json()

        # Validate required fields
        if not data.get('items') or not data.get('shipping_address_id') or not data.get('payment_method_id'):
            return jsonify({'message': 'Missing required fields'}), 400

        # Validate address belongs to user
        address = Address.query.filter_by(id=data['shipping_address_id'], user_id=user_id).first()
        if not address:
            return jsonify({'message': 'Invalid shipping address'}), 400

        # Validate payment method belongs to user
        payment_method = PaymentMethod.query.filter_by(id=data['payment_method_id'], user_id=user_id).first()
        if not payment_method:
            return jsonify({'message': 'Invalid payment method'}), 400

        # Group items by store
        items_by_store = {}
        for item in data['items']:
            product = Product.query.get(item['id'])
            if not product:
                return jsonify({'message': f'Invalid product: {item["id"]}'}), 400
            
            store_id = product.store_id
            if store_id not in items_by_store:
                items_by_store[store_id] = []
            
            items_by_store[store_id].append({
                'product_id': item['id'],
                'quantity': item['quantity'],
                'price': item['price']
            })

        # Calculate shipping address string
        shipping_address_str = f"{address.street_address}, {address.city}, {address.state} {address.postal_code}, {address.country}"

        # Get original totals for calculation
        subtotal = data.get('subtotal', 0)
        tax = data.get('tax', 0)
        shipping_cost = data.get('shipping_cost', 0)
        total_amount = data.get('total', subtotal + tax + shipping_cost)

        # Create separate orders for each store
        created_orders = []
        num_stores = len(items_by_store)

        for store_id, store_items in items_by_store.items():
            # Calculate this store's portion
            store_subtotal = sum(item['price'] * item['quantity'] for item in store_items)
            
            # Split tax and shipping proportionally
            proportion = store_subtotal / subtotal if subtotal > 0 else (1 / num_stores)
            store_tax = tax * proportion
            store_shipping = shipping_cost * proportion
            store_total = store_subtotal + store_tax + store_shipping

            # Create order for this store
            order = Order(
                user_id=user_id,
                store_id=store_id,
                total_amount=store_total,
                status='pending',
                shipping_address=shipping_address_str
            )
            db.session.add(order)
            db.session.flush()

            # Add order items for this store
            for item in store_items:
                order_item = OrderItem(
                    order_id=order.id,
                    product_id=item['product_id'],
                    quantity=item['quantity'],
                    price=item['price']
                )
                db.session.add(order_item)

            # Create payment record
            payment = Payment(
                order_id=order.id,
                amount=store_total,
                payment_method=payment_method.card_type,
                status='completed',
                transaction_id=f"TXN_{order.id}_{datetime.utcnow().timestamp()}"
            )
            db.session.add(payment)

            created_orders.append({
                'order_id': order.id,
                'store_id': store_id,
                'amount': store_total,
                'items_count': len(store_items)
            })

        db.session.commit()

        logger.info(f"Created {len(created_orders)} orders for user {user_id}: {[o['order_id'] for o in created_orders]}")

        return jsonify({
            'message': 'Orders placed successfully',
            'orders': created_orders,
            'total_amount': total_amount,
            'num_orders': len(created_orders)
        }), 201

    except Exception as e:
        db.session.rollback()
        logger.error(f"Error creating order: {str(e)}")
        return jsonify({'message': f'Error creating order: {str(e)}'}), 500

@orders_bp.route('', methods=['GET'])
@jwt_required()
def get_orders():
    """Get all orders for current user"""
    try:
        user_id = get_jwt_identity()
        orders = Order.query.filter_by(user_id=user_id).order_by(Order.created_at.desc()).all()

        orders_data = []
        for order in orders:
            order_dict = {
                'id': order.id,
                'store_id': order.store_id,
                'total_amount': order.total_amount,
                'status': order.status,
                'shipping_address': order.shipping_address,
                'created_at': order.created_at.isoformat(),
                'updated_at': order.updated_at.isoformat(),
                'items': [
                    {
                        'product_id': item.product_id,
                        'quantity': item.quantity,
                        'price': item.price
                    }
                    for item in order.items
                ]
            }
            orders_data.append(order_dict)

        return jsonify(orders_data), 200

    except Exception as e:
        logger.error(f"Error fetching orders: {str(e)}")
        return jsonify({'message': f'Error fetching orders: {str(e)}'}), 500

@orders_bp.route('/<int:order_id>', methods=['GET'])
@jwt_required()
def get_order(order_id):
    """Get specific order details"""
    try:
        user_id = get_jwt_identity()
        order = Order.query.filter_by(id=order_id, user_id=user_id).first()

        if not order:
            return jsonify({'message': 'Order not found'}), 404

        order_dict = {
            'id': order.id,
            'store_id': order.store_id,
            'total_amount': order.total_amount,
            'status': order.status,
            'shipping_address': order.shipping_address,
            'created_at': order.created_at.isoformat(),
            'updated_at': order.updated_at.isoformat(),
            'items': [
                {
                    'product_id': item.product_id,
                    'quantity': item.quantity,
                    'price': item.price
                }
                for item in order.items
            ],
            'payment': {
                'amount': order.payment.amount,
                'payment_method': order.payment.payment_method,
                'status': order.payment.status,
                'created_at': order.payment.created_at.isoformat()
            } if order.payment else None
        }

        return jsonify(order_dict), 200

    except Exception as e:
        logger.error(f"Error fetching order: {str(e)}")
        return jsonify({'message': f'Error fetching order: {str(e)}'}), 500

@orders_bp.route('/<int:order_id>', methods=['PUT'])
@jwt_required()
def update_order_status(order_id):
    """Update order status (admin/store only)"""
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        data = request.get_json()

        # Check if user is admin/manager
        order = Order.query.get(order_id)
        if not order:
            return jsonify({'message': 'Order not found'}), 404

        # Only store manager or admin can update order status
        if order.store_id != user.store.id if user.store else False and user.role != 'super_admin':
            return jsonify({'message': 'Unauthorized'}), 403

        if 'status' in data:
            order.status = data['status']
            order.updated_at = datetime.utcnow()
            db.session.commit()
            logger.info(f"Order {order_id} status updated to {data['status']}")

        return jsonify({
            'message': 'Order updated successfully',
            'status': order.status
        }), 200

    except Exception as e:
        db.session.rollback()
        logger.error(f"Error updating order: {str(e)}")
        return jsonify({'message': f'Error updating order: {str(e)}'}), 500

@orders_bp.route('/<int:order_id>/cancel', methods=['PUT'])
@jwt_required()
def cancel_order(order_id):
    """Cancel an order"""
    try:
        user_id = get_jwt_identity()
        order = Order.query.filter_by(id=order_id, user_id=user_id).first()

        if not order:
            return jsonify({'message': 'Order not found'}), 404

        if order.status not in ['pending', 'processing']:
            return jsonify({'message': 'Order cannot be cancelled at this stage'}), 400

        order.status = 'cancelled'
        order.updated_at = datetime.utcnow()
        db.session.commit()

        logger.info(f"Order {order_id} cancelled by user {user_id}")

        return jsonify({
            'message': 'Order cancelled successfully',
            'order_id': order.id,
            'status': order.status
        }), 200

    except Exception as e:
        db.session.rollback()
        logger.error(f"Error cancelling order: {str(e)}")
        return jsonify({'message': f'Error cancelling order: {str(e)}'}), 500

@orders_bp.route('/manager/all', methods=['GET'])
@jwt_required()
def get_manager_orders():
    """Get all orders for manager's store"""
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)

        # Check if user is a manager
        if not user.store:
            return jsonify({'message': 'Not authorized'}), 403

        store_id = user.store.id
        orders = Order.query.filter_by(store_id=store_id).order_by(Order.created_at.desc()).all()

        orders_data = []
        for order in orders:
            customer = User.query.get(order.user_id)
            order_dict = {
                'id': order.id,
                'customer_name': customer.name,
                'customer_email': customer.email,
                'store_id': order.store_id,
                'total_amount': order.total_amount,
                'status': order.status,
                'shipping_address': order.shipping_address,
                'created_at': order.created_at.isoformat(),
                'updated_at': order.updated_at.isoformat(),
                'items': [
                    {
                        'product_id': item.product_id,
                        'quantity': item.quantity,
                        'price': item.price
                    }
                    for item in order.items
                ]
            }
            orders_data.append(order_dict)

        return jsonify(orders_data), 200

    except Exception as e:
        logger.error(f"Error fetching manager orders: {str(e)}")
        return jsonify({'message': f'Error fetching orders: {str(e)}'}), 500

@orders_bp.route('/admin/all', methods=['GET'])
@jwt_required()
def get_admin_orders():
    """Get all orders for super admin"""
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)

        # Check if user is super admin
        if user.role != 'super_admin':
            return jsonify({'message': 'Not authorized'}), 403

        orders = Order.query.order_by(Order.created_at.desc()).all()

        orders_data = []
        for order in orders:
            customer = User.query.get(order.user_id)
            store = order.store
            order_dict = {
                'id': order.id,
                'customer_name': customer.name,
                'customer_email': customer.email,
                'store_name': store.name if store else 'Unknown',
                'store_id': order.store_id,
                'total_amount': order.total_amount,
                'status': order.status,
                'shipping_address': order.shipping_address,
                'created_at': order.created_at.isoformat(),
                'updated_at': order.updated_at.isoformat(),
                'items_count': len(order.items),
                'items': [
                    {
                        'product_id': item.product_id,
                        'quantity': item.quantity,
                        'price': item.price
                    }
                    for item in order.items
                ]
            }
            orders_data.append(order_dict)

        return jsonify(orders_data), 200

    except Exception as e:
        logger.error(f"Error fetching admin orders: {str(e)}")
        return jsonify({'message': f'Error fetching orders: {str(e)}'}), 500
