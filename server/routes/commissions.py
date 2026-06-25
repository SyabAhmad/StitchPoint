from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, Commission, Product, Store, User, CommissionRate
import logging

commissions_bp = Blueprint('commissions', __name__, url_prefix='/api/commissions')
logger = logging.getLogger(__name__)

@commissions_bp.route('', methods=['GET'])
@jwt_required()
def get_commissions():
    """Get all commissions with product and store details (paginated)"""
    try:
        user_id = get_jwt_identity()
        user = User.query.get(int(user_id))

        if not user or user.role != 'super_admin':
            return jsonify({'message': 'Unauthorized'}), 403

        # Get pagination parameters
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 10, type=int)
        
        # Ensure reasonable pagination limits
        per_page = min(max(per_page, 1), 100)  # Max 100 items per page

        # Get total count for pagination
        total_count = Product.query.join(Store).count()

        # Get paginated products
        products = Product.query.join(Store).paginate(
            page=page,
            per_page=per_page,
            error_out=False
        )

        commissions_data = []
        for product in products.items:
            commission = Commission.query.filter_by(product_id=product.id).first()
            applicable_rate = CommissionRate.query.filter(
                CommissionRate.is_active == True,
                CommissionRate.min_price <= product.price,
                db.or_(CommissionRate.max_price.is_(None), CommissionRate.max_price >= product.price)
            ).first()
            product_data = {
                'product_id': product.id,
                'product_name': product.name,
                'store_id': product.store_id,
                'store_name': product.store.name,
                'price': product.price,
                'commission_id': commission.id if commission else None,
                'commission_percentage': commission.commission_percentage if commission else None,
                'commission_amount': commission.commission_amount if commission else None,
                'commission_is_manual': commission.is_manual if commission else False,
                'tier_commission_percentage': applicable_rate.commission_percentage if applicable_rate else None,
                'created_at': commission.created_at.isoformat() if commission else None,
                'updated_at': commission.updated_at.isoformat() if commission else None
            }
            commissions_data.append(product_data)

        # Return paginated response with metadata
        return jsonify({
            'commissions': commissions_data,
            'pagination': {
                'page': page,
                'per_page': per_page,
                'total': total_count,
                'pages': (total_count + per_page - 1) // per_page,
                'has_next': products.has_next,
                'has_prev': products.has_prev
            }
        }), 200

    except Exception as e:
        logger.error(f"Error fetching commissions: {str(e)}")
        return jsonify({'message': f'Error fetching commissions: {str(e)}'}), 500

@commissions_bp.route('', methods=['POST'])
@jwt_required()
def create_or_update_commission():
    """Create or update commission for a product"""
    try:
        user_id = get_jwt_identity()
        user = User.query.get(int(user_id))

        if not user or user.role != 'super_admin':
            return jsonify({'message': 'Unauthorized'}), 403

        data = request.get_json()

        if not data.get('product_id'):
            return jsonify({'message': 'product_id is required'}), 400

        product_id = data['product_id']
        commission_percentage = data.get('commission_percentage')
        commission_amount = data.get('commission_amount')
        reset_to_default = data.get('reset_to_default', False)

        # Allow reset request
        if reset_to_default:
            existing_commission = Commission.query.filter_by(product_id=product_id).first()
            applicable_rate = CommissionRate.query.filter(
                CommissionRate.is_active == True,
                CommissionRate.min_price <= product.price,
                db.or_(CommissionRate.max_price.is_(None), CommissionRate.max_price >= product.price)
            ).first()

            if applicable_rate:
                if existing_commission:
                    existing_commission.commission_percentage = applicable_rate.commission_percentage
                    existing_commission.commission_amount = None
                    existing_commission.is_manual = False
                    existing_commission.updated_at = db.func.now()
                else:
                    commission = Commission(
                        product_id=product_id,
                        store_id=product.store_id,
                        commission_percentage=applicable_rate.commission_percentage,
                        commission_amount=None,
                        is_manual=False
                    )
                    db.session.add(commission)
            elif existing_commission:
                # No applicable rate; remove commission record entirely
                db.session.delete(existing_commission)

            db.session.commit()
            return jsonify({'message': 'Commission reset to tier default'}), 200

        # Validate that at least one commission type is provided
        if commission_percentage is None and commission_amount is None:
            return jsonify({'message': 'Either commission_percentage or commission_amount must be provided'}), 400

        # Validate percentage range
        if commission_percentage is not None and (commission_percentage < 0 or commission_percentage > 100):
            return jsonify({'message': 'commission_percentage must be between 0 and 100'}), 400

        # Validate amount is positive
        if commission_amount is not None and commission_amount < 0:
            return jsonify({'message': 'commission_amount must be positive'}), 400

        # Check if product exists
        product = Product.query.get(product_id)
        if not product:
            return jsonify({'message': 'Product not found'}), 404

        # Check if commission already exists for this product
        existing_commission = Commission.query.filter_by(product_id=product_id).first()

        if existing_commission:
            # Update existing commission
            existing_commission.commission_percentage = commission_percentage
            existing_commission.commission_amount = commission_amount
            existing_commission.is_manual = True
            existing_commission.updated_at = db.func.now()
            commission = existing_commission
            message = 'Commission updated successfully'
        else:
            # Create new commission
            commission = Commission(
                product_id=product_id,
                store_id=product.store_id,
                commission_percentage=commission_percentage,
                commission_amount=commission_amount,
                is_manual=True
            )
            db.session.add(commission)
            message = 'Commission created successfully'

        db.session.commit()

        logger.info(f"Commission {'updated' if existing_commission else 'created'} for product {product_id}")

        return jsonify({
            'message': message,
            'commission': {
                'id': commission.id,
                'product_id': commission.product_id,
                'store_id': commission.store_id,
                'commission_percentage': commission.commission_percentage,
                'commission_amount': commission.commission_amount,
                'created_at': commission.created_at.isoformat(),
                'updated_at': commission.updated_at.isoformat()
            }
        }), 201 if not existing_commission else 200

    except Exception as e:
        db.session.rollback()
        logger.error(f"Error creating/updating commission: {str(e)}")
        return jsonify({'message': f'Error creating/updating commission: {str(e)}'}), 500

@commissions_bp.route('/<int:commission_id>', methods=['PUT'])
@jwt_required()
def update_commission(commission_id):
    """Update a specific commission"""
    try:
        user_id = get_jwt_identity()
        user = User.query.get(int(user_id))

        if not user or user.role != 'super_admin':
            return jsonify({'message': 'Unauthorized'}), 403

        commission = Commission.query.get(commission_id)
        if not commission:
            return jsonify({'message': 'Commission not found'}), 404

        data = request.get_json()
        commission_percentage = data.get('commission_percentage')
        commission_amount = data.get('commission_amount')

        # Validate that at least one commission type is provided
        if commission_percentage is None and commission_amount is None:
            return jsonify({'message': 'Either commission_percentage or commission_amount must be provided'}), 400

        # Validate percentage range
        if commission_percentage is not None and (commission_percentage < 0 or commission_percentage > 100):
            return jsonify({'message': 'commission_percentage must be between 0 and 100'}), 400

        # Validate amount is positive
        if commission_amount is not None and commission_amount < 0:
            return jsonify({'message': 'commission_amount must be positive'}), 400

        commission.commission_percentage = commission_percentage
        commission.commission_amount = commission_amount
        commission.updated_at = db.func.now()

        db.session.commit()

        logger.info(f"Commission {commission_id} updated")

        return jsonify({
            'message': 'Commission updated successfully',
            'commission': {
                'id': commission.id,
                'product_id': commission.product_id,
                'store_id': commission.store_id,
                'commission_percentage': commission.commission_percentage,
                'commission_amount': commission.commission_amount,
                'updated_at': commission.updated_at.isoformat()
            }
        }), 200

    except Exception as e:
        db.session.rollback()
        logger.error(f"Error updating commission: {str(e)}")
        return jsonify({'message': f'Error updating commission: {str(e)}'}), 500

@commissions_bp.route('/<int:commission_id>', methods=['DELETE'])
@jwt_required()
def delete_commission(commission_id):
    """Delete a commission"""
    try:
        user_id = get_jwt_identity()
        user = User.query.get(int(user_id))

        if not user or user.role != 'super_admin':
            return jsonify({'message': 'Unauthorized'}), 403

        commission = Commission.query.get(commission_id)
        if not commission:
            return jsonify({'message': 'Commission not found'}), 404

        db.session.delete(commission)
        db.session.commit()

        logger.info(f"Commission {commission_id} deleted")

        return jsonify({'message': 'Commission deleted successfully'}), 200

    except Exception as e:
        db.session.rollback()
        logger.error(f"Error deleting commission: {str(e)}")
        return jsonify({'message': f'Error deleting commission: {str(e)}'}), 500
