from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, CommissionRate, User, Notification
from datetime import datetime
import json

commission_rates_bp = Blueprint('commission_rates', __name__, url_prefix='/api/commission-rates')

@commission_rates_bp.route('', methods=['GET'])
@jwt_required()
def get_commission_rates():
    """Get all commission rates"""
    try:
        user_id = int(get_jwt_identity())
        user = User.query.get(user_id)
        
        if not user or user.role != 'super_admin':
            return jsonify({'message': 'Unauthorized'}), 403
        
        rates = CommissionRate.query.order_by(CommissionRate.min_price.asc()).all()
        
        rates_data = [{
            'id': rate.id,
            'name': rate.name,
            'min_price': rate.min_price,
            'max_price': rate.max_price,
            'commission_percentage': rate.commission_percentage,
            'is_active': rate.is_active,
            'effective_date': rate.effective_date.isoformat(),
            'created_at': rate.created_at.isoformat()
        } for rate in rates]
        
        return jsonify({'commission_rates': rates_data}), 200
        
    except Exception as e:
        return jsonify({'message': f'Error fetching commission rates: {str(e)}'}), 500

@commission_rates_bp.route('', methods=['POST'])
@jwt_required()
def create_commission_rate():
    """Create a new commission rate"""
    try:
        user_id = int(get_jwt_identity())
        user = User.query.get(user_id)
        
        if not user or user.role != 'super_admin':
            return jsonify({'message': 'Unauthorized'}), 403
        
        data = request.get_json()
        
        if not data.get('name') or data.get('commission_percentage') is None:
            return jsonify({'message': 'Name and commission_percentage are required'}), 400
        
        min_price = data.get('min_price', 0.0)
        max_price = data.get('max_price')
        commission_percentage = data.get('commission_percentage')
        effective_date = data.get('effective_date')
        
        if commission_percentage < 0 or commission_percentage > 100:
            return jsonify({'message': 'Commission percentage must be between 0 and 100'}), 400
        
        # Check for overlapping price ranges
        existing_rates = CommissionRate.query.filter_by(is_active=True).all()
        for rate in existing_rates:
            if not rate.max_price:  # Unlimited max price
                if min_price >= rate.min_price:
                    return jsonify({'message': f'Price range overlaps with existing rate: {rate.name}'}), 400
            else:
                if (min_price >= rate.min_price and min_price < rate.max_price) or \
                   (max_price and max_price > rate.min_price and max_price <= rate.max_price) or \
                   (min_price <= rate.min_price and (not max_price or max_price >= rate.max_price)):
                    return jsonify({'message': f'Price range overlaps with existing rate: {rate.name}'}), 400
        
        new_rate = CommissionRate(
            name=data['name'],
            min_price=min_price,
            max_price=max_price,
            commission_percentage=commission_percentage,
            effective_date=datetime.fromisoformat(effective_date) if effective_date else datetime.utcnow()
        )
        
        db.session.add(new_rate)
        db.session.commit()
        
        # Send notifications to all managers about the new commission rate
        send_commission_change_notification(
            f"New Commission Rate Added: {data['name']}",
            f"A new commission rate of {commission_percentage}% has been added for products priced {min_price}-{max_price or 'unlimited'}.",
            None  # System-wide notification
        )
        
        return jsonify({
            'message': 'Commission rate created successfully',
            'commission_rate': {
                'id': new_rate.id,
                'name': new_rate.name,
                'min_price': new_rate.min_price,
                'max_price': new_rate.max_price,
                'commission_percentage': new_rate.commission_percentage,
                'effective_date': new_rate.effective_date.isoformat()
            }
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': f'Error creating commission rate: {str(e)}'}), 500

@commission_rates_bp.route('/<int:rate_id>', methods=['PUT'])
@jwt_required()
def update_commission_rate(rate_id):
    """Update a commission rate"""
    try:
        user_id = int(get_jwt_identity())
        user = User.query.get(user_id)
        
        if not user or user.role != 'super_admin':
            return jsonify({'message': 'Unauthorized'}), 403
        
        rate = CommissionRate.query.get(rate_id)
        if not rate:
            return jsonify({'message': 'Commission rate not found'}), 404
        
        data = request.get_json()
        
        old_percentage = rate.commission_percentage
        old_name = rate.name
        
        # Update fields
        if 'name' in data:
            rate.name = data['name']
        if 'min_price' in data:
            rate.min_price = data['min_price']
        if 'max_price' in data:
            rate.max_price = data['max_price']
        if 'commission_percentage' in data:
            percentage = data['commission_percentage']
            if percentage is None or percentage < 0 or percentage > 100:
                return jsonify({'message': 'Commission percentage must be between 0 and 100'}), 400
            rate.commission_percentage = percentage
        if 'is_active' in data:
            rate.is_active = data['is_active']
        
        # Check for overlapping price ranges (exclude current rate)
        if 'min_price' in data or 'max_price' in data:
            existing_rates = CommissionRate.query.filter(CommissionRate.id != rate_id, CommissionRate.is_active == True).all()
            for existing_rate in existing_rates:
                min_price = rate.min_price if rate.min_price is not None else 0
                max_price = rate.max_price if rate.max_price is not None else float('inf')
                existing_min = existing_rate.min_price if existing_rate.min_price is not None else 0
                existing_max = existing_rate.max_price if existing_rate.max_price is not None else float('inf')
                
                # Skip comparison if either rate has null min_price
                if rate.min_price is None or existing_rate.min_price is None:
                    continue
                    
                # Check overlap: ranges overlap if one starts before the other ends
                if min_price < existing_max and max_price > existing_min:
                    return jsonify({'message': f'Price range overlaps with existing rate: {existing_rate.name}'}), 400
        
        rate.updated_at = datetime.utcnow()
        db.session.commit()
        
        # Send notifications if commission percentage changed
        if 'commission_percentage' in data and data['commission_percentage'] != old_percentage:
            send_commission_change_notification(
                f"Commission Rate Updated: {old_name}",
                f"Commission rate changed from {old_percentage}% to {data['commission_percentage']}% for products priced {rate.min_price}-{rate.max_price or 'unlimited'}.",
                None  # System-wide notification
            )
        
        return jsonify({
            'message': 'Commission rate updated successfully',
            'commission_rate': {
                'id': rate.id,
                'name': rate.name,
                'min_price': rate.min_price,
                'max_price': rate.max_price,
                'commission_percentage': rate.commission_percentage,
                'is_active': rate.is_active,
                'updated_at': rate.updated_at.isoformat()
            }
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': f'Error updating commission rate: {str(e)}'}), 500

@commission_rates_bp.route('/<int:rate_id>', methods=['DELETE'])
@jwt_required()
def delete_commission_rate(rate_id):
    """Delete a commission rate"""
    try:
        user_id = int(get_jwt_identity())
        user = User.query.get(user_id)
        
        if not user or user.role != 'super_admin':
            return jsonify({'message': 'Unauthorized'}), 403
        
        rate = CommissionRate.query.get(rate_id)
        if not rate:
            return jsonify({'message': 'Commission rate not found'}), 404
        
        # Instead of deleting, deactivate the rate
        rate.is_active = False
        rate.updated_at = datetime.utcnow()
        
        # Send notification about deactivation
        send_commission_change_notification(
            f"Commission Rate Deactivated: {rate.name}",
            f"Commission rate for products priced {rate.min_price}-{rate.max_price or 'unlimited'} has been deactivated.",
            None  # System-wide notification
        )
        
        db.session.commit()
        
        return jsonify({'message': 'Commission rate deactivated successfully'}), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': f'Error deactivating commission rate: {str(e)}'}), 500

@commission_rates_bp.route('/calculate', methods=['POST'])
@jwt_required()
def calculate_commission():
    """Calculate commission for a product price"""
    try:
        user_id = int(get_jwt_identity())
        user = User.query.get(user_id)
        
        if not user or user.role not in ['manager', 'super_admin']:
            return jsonify({'message': 'Unauthorized'}), 403
        
        data = request.get_json()
        product_price = data.get('product_price')
        
        if not product_price or product_price <= 0:
            return jsonify({'message': 'Valid product price is required'}), 400
        
        # Find applicable commission rate
        applicable_rate = CommissionRate.query.filter(
            CommissionRate.is_active == True,
            CommissionRate.min_price <= product_price,
            db.or_(CommissionRate.max_price.is_(None), CommissionRate.max_price >= product_price)
        ).first()
        
        if not applicable_rate:
            return jsonify({
                'commission_rate': 0,
                'commission_amount': 0,
                'message': 'No applicable commission rate found'
            }), 200
        
        commission_amount = (product_price * applicable_rate.commission_percentage) / 100
        
        return jsonify({
            'commission_rate': applicable_rate.commission_percentage,
            'commission_amount': round(commission_amount, 2),
            'applicable_rate': {
                'id': applicable_rate.id,
                'name': applicable_rate.name,
                'min_price': applicable_rate.min_price,
                'max_price': applicable_rate.max_price
            }
        }), 200
        
    except Exception as e:
        return jsonify({'message': f'Error calculating commission: {str(e)}'}), 500

def send_commission_change_notification(title, message, user_id=None):
    """Helper function to send commission change notifications"""
    try:
        notification = Notification(
            user_id=user_id,  # None for system-wide notifications
            title=title,
            message=message,
            type='commission_change',
            data=json.dumps({'timestamp': datetime.utcnow().isoformat()})
        )
        db.session.add(notification)
        db.session.commit()
    except Exception as e:
        print(f"Error sending notification: {e}")
        db.session.rollback()