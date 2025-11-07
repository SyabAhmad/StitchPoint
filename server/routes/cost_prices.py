from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, User, Product

cost_prices_bp = Blueprint('cost_prices', __name__)

@cost_prices_bp.route('', methods=['GET'])
@jwt_required()
def get_cost_prices():
    try:
        user_id = int(get_jwt_identity())
    except (TypeError, ValueError):
        return jsonify({'message': 'Invalid token identity'}), 422

    user = User.query.get(user_id)
    if not user or user.role not in ['manager', 'super_admin']:
        return jsonify({'message': 'Unauthorized'}), 403

    # For super admins, show all products; for managers, only their store's products
    if user.role == 'manager':
        if not user.store:
            return jsonify({'message': 'Manager has no associated store'}), 403
        products = Product.query.filter_by(store_id=user.store.id).all()
    else:
        # Super admin can see all products
        products = Product.query.all()

    products_data = [{
        'id': p.id,
        'name': p.name,
        'price': p.price,
        'cost_price': p.cost_price,
        'stock_quantity': p.stock_quantity
    } for p in products]

    return jsonify({'products': products_data}), 200

@cost_prices_bp.route('', methods=['PUT'])
@jwt_required()
def update_cost_prices():
    try:
        user_id = int(get_jwt_identity())
    except (TypeError, ValueError):
        return jsonify({'message': 'Invalid token identity'}), 422

    user = User.query.get(user_id)
    if not user or user.role != 'manager':
        return jsonify({'message': 'Unauthorized'}), 403

    data = request.get_json() or {}
    updates = data.get('updates', [])

    if not updates:
        return jsonify({'message': 'No updates provided'}), 400

    updated_count = 0
    for update in updates:
        product_id = update.get('product_id')
        cost_price = update.get('cost_price')

        if product_id is None or cost_price is None:
            continue

        # Only allow managers to update cost prices for their store's products
        if not user.store:
            continue
        product = Product.query.filter_by(id=product_id, store_id=user.store.id).first()

        if not product:
            continue

        # Validate cost_price
        try:
            cost_price = float(cost_price)
            if cost_price < 0:
                continue
        except (ValueError, TypeError):
            continue

        product.cost_price = cost_price
        updated_count += 1

    db.session.commit()

    return jsonify({
        'message': f'Updated cost prices for {updated_count} products',
        'updated_count': updated_count
    }), 200
