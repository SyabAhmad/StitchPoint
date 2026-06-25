from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, Wishlist, WishlistItem, Product, User
from sqlalchemy.exc import IntegrityError

wishlist_bp = Blueprint('wishlist', __name__)

@wishlist_bp.route('', methods=['GET'])
@jwt_required()
def get_wishlist():
    """Get user's wishlist items"""
    try:
        user_id = get_jwt_identity()

        # Get or create user's wishlist
        wishlist = Wishlist.query.filter_by(user_id=user_id).first()
        if not wishlist:
            wishlist = Wishlist(user_id=user_id)
            db.session.add(wishlist)
            db.session.commit()

        # Get wishlist items with product details
        wishlist_items = db.session.query(WishlistItem, Product).join(
            Product, WishlistItem.product_id == Product.id
        ).filter(WishlistItem.wishlist_id == wishlist.id).all()

        items_data = []
        for wishlist_item, product in wishlist_items:
            items_data.append({
                'id': product.id,
                'name': product.name,
                'price': product.price,
                'image_url': product.image_url,
                'store': {
                    'id': product.store.id,
                    'name': product.store.name
                } if product.store else None,
                'added_at': wishlist_item.added_at.isoformat()
            })

        return jsonify({'wishlist_items': items_data}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@wishlist_bp.route('/add', methods=['POST'])
@jwt_required()
def add_to_wishlist():
    """Add product to user's wishlist"""
    try:
        user_id = get_jwt_identity()
        data = request.get_json()

        if not data or 'product_id' not in data:
            return jsonify({'error': 'Product ID is required'}), 400

        product_id = data['product_id']

        # Check if product exists
        product = Product.query.get(product_id)
        if not product:
            return jsonify({'error': 'Product not found'}), 404

        # Get or create user's wishlist
        wishlist = Wishlist.query.filter_by(user_id=user_id).first()
        if not wishlist:
            wishlist = Wishlist(user_id=user_id)
            db.session.add(wishlist)
            db.session.commit()

        # Check if item already in wishlist
        existing_item = WishlistItem.query.filter_by(
            wishlist_id=wishlist.id,
            product_id=product_id
        ).first()

        if existing_item:
            return jsonify({'message': 'Product already in wishlist'}), 200

        # Add item to wishlist
        wishlist_item = WishlistItem(
            wishlist_id=wishlist.id,
            product_id=product_id
        )
        db.session.add(wishlist_item)
        db.session.commit()

        return jsonify({'message': 'Product added to wishlist'}), 201

    except IntegrityError:
        db.session.rollback()
        return jsonify({'error': 'Product already in wishlist'}), 400
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@wishlist_bp.route('/remove/<int:product_id>', methods=['DELETE'])
@jwt_required()
def remove_from_wishlist(product_id):
    """Remove product from user's wishlist"""
    try:
        user_id = get_jwt_identity()

        # Get user's wishlist
        wishlist = Wishlist.query.filter_by(user_id=user_id).first()
        if not wishlist:
            return jsonify({'error': 'Wishlist not found'}), 404

        # Find and remove the item
        wishlist_item = WishlistItem.query.filter_by(
            wishlist_id=wishlist.id,
            product_id=product_id
        ).first()

        if not wishlist_item:
            return jsonify({'error': 'Product not in wishlist'}), 404

        db.session.delete(wishlist_item)
        db.session.commit()

        return jsonify({'message': 'Product removed from wishlist'}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@wishlist_bp.route('/check/<int:product_id>', methods=['GET'])
@jwt_required()
def check_in_wishlist(product_id):
    """Check if product is in user's wishlist"""
    try:
        user_id = get_jwt_identity()

        # Get user's wishlist
        wishlist = Wishlist.query.filter_by(user_id=user_id).first()
        if not wishlist:
            return jsonify({'in_wishlist': False}), 200

        # Check if item exists
        wishlist_item = WishlistItem.query.filter_by(
            wishlist_id=wishlist.id,
            product_id=product_id
        ).first()

        return jsonify({'in_wishlist': wishlist_item is not None}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@wishlist_bp.route('/clear', methods=['DELETE'])
@jwt_required()
def clear_wishlist():
    """Clear all items from user's wishlist"""
    try:
        user_id = get_jwt_identity()

        # Get user's wishlist
        wishlist = Wishlist.query.filter_by(user_id=user_id).first()
        if not wishlist:
            return jsonify({'message': 'Wishlist is already empty'}), 200

        # Delete all wishlist items
        WishlistItem.query.filter_by(wishlist_id=wishlist.id).delete()
        db.session.commit()

        return jsonify({'message': 'Wishlist cleared'}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500
