from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from datetime import datetime
from models import db, Review, Order, OrderItem, Product, User
from werkzeug.utils import secure_filename
import os
import logging

reviews_bp = Blueprint('reviews', __name__, url_prefix='/api/reviews')
logger = logging.getLogger(__name__)

UPLOAD_FOLDER = os.path.join(os.path.dirname(__file__), '..', 'uploads', 'reviews')
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}

# Create uploads folder if it doesn't exist
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@reviews_bp.route('', methods=['POST'])
@jwt_required()
def create_review():
    """Create a review for a product from an order"""
    try:
        user_id = get_jwt_identity()
        
        # Get form data
        product_id = request.form.get('product_id')
        order_id = request.form.get('order_id')
        order_item_id = request.form.get('order_item_id')
        rating = request.form.get('rating', type=int)
        comment = request.form.get('comment', '')

        # Validate required fields
        if not product_id or not rating:
            return jsonify({'message': 'Product ID and rating are required'}), 400

        if rating < 1 or rating > 5:
            return jsonify({'message': 'Rating must be between 1 and 5'}), 400

        if not comment or not comment.strip():
            return jsonify({'message': 'Comment is required'}), 400

        # Verify order exists and belongs to user
        if order_id:
            order = Order.query.filter_by(id=order_id, user_id=user_id).first()
            if not order:
                return jsonify({'message': 'Order not found'}), 404

        # Check if already reviewed this product from this order
        existing_review = Review.query.filter_by(
            product_id=product_id,
            user_id=user_id
        ).first()

        if existing_review:
            return jsonify({'message': 'You have already reviewed this product'}), 400

        # Get user info
        user = User.query.get(user_id)

        # Handle image uploads
        image_paths = []
        if 'images' in request.files:
            files = request.files.getlist('images')
            for file in files:
                if file and file.filename and allowed_file(file.filename):
                    # Create secure filename
                    timestamp = datetime.utcnow().strftime('%Y%m%d_%H%M%S')
                    filename = f"{user_id}_{product_id}_{timestamp}_{secure_filename(file.filename)}"
                    filepath = os.path.join(UPLOAD_FOLDER, filename)
                    
                    # Save file
                    file.save(filepath)
                    image_paths.append(f"/uploads/reviews/{filename}")

        # Create review
        review = Review(
            product_id=product_id,
            user_id=user_id,
            user_name=user.name if user else 'Anonymous',
            rating=rating,
            comment=comment
        )
        
        db.session.add(review)
        db.session.flush()  # Get the review ID

        # Store images (we'll add a simple storage mechanism)
        # For now, storing paths as JSON string in a new field if needed
        if image_paths:
            # You may want to add an images field to Review model in future
            logger.info(f"Review {review.id} has {len(image_paths)} images: {image_paths}")

        db.session.commit()

        logger.info(f"Review {review.id} created by user {user_id} for product {product_id}")

        return jsonify({
            'message': 'Review submitted successfully',
            'review_id': review.id,
            'rating': review.rating,
            'images': image_paths
        }), 201

    except Exception as e:
        db.session.rollback()
        logger.error(f"Error creating review: {str(e)}")
        return jsonify({'message': f'Error creating review: {str(e)}'}), 500

@reviews_bp.route('/order/<int:order_id>/pending', methods=['GET'])
@jwt_required()
def get_pending_reviews(order_id):
    """Get products in a delivered order that haven't been reviewed yet"""
    try:
        user_id = get_jwt_identity()

        # Verify order exists and belongs to user
        order = Order.query.filter_by(id=order_id, user_id=user_id).first()
        if not order:
            return jsonify({'message': 'Order not found'}), 404

        # Check if order is delivered
        if order.status != 'delivered':
            return jsonify({'message': 'Order must be delivered to review'}), 400

        # Get all items in order
        order_items = OrderItem.query.filter_by(order_id=order_id).all()

        pending_reviews = []
        for item in order_items:
            product = Product.query.get(item.product_id)
            
            # Check if already reviewed
            existing_review = Review.query.filter_by(
                product_id=item.product_id,
                user_id=user_id
            ).first()

            if not existing_review and product:
                pending_reviews.append({
                    'order_item_id': item.id,
                    'product_id': product.id,
                    'product_name': product.name,
                    'product_image': product.image,
                    'quantity': item.quantity,
                    'price': item.price
                })

        return jsonify(pending_reviews), 200

    except Exception as e:
        logger.error(f"Error fetching pending reviews: {str(e)}")
        return jsonify({'message': f'Error: {str(e)}'}), 500

@reviews_bp.route('/<int:review_id>', methods=['GET'])
def get_review(review_id):
    """Get a specific review"""
    try:
        review = Review.query.get(review_id)
        if not review:
            return jsonify({'message': 'Review not found'}), 404

        return jsonify({
            'id': review.id,
            'product_id': review.product_id,
            'user_name': review.user_name,
            'rating': review.rating,
            'comment': review.comment,
            'created_at': review.created_at.isoformat()
        }), 200

    except Exception as e:
        logger.error(f"Error fetching review: {str(e)}")
        return jsonify({'message': f'Error: {str(e)}'}), 500

@reviews_bp.route('/<int:review_id>', methods=['DELETE'])
@jwt_required()
def delete_review(review_id):
    """Delete a review (only by owner)"""
    try:
        user_id = get_jwt_identity()
        review = Review.query.get(review_id)

        if not review:
            return jsonify({'message': 'Review not found'}), 404

        if review.user_id != user_id:
            return jsonify({'message': 'Unauthorized'}), 403

        db.session.delete(review)
        db.session.commit()

        logger.info(f"Review {review_id} deleted by user {user_id}")

        return jsonify({'message': 'Review deleted'}), 200

    except Exception as e:
        db.session.rollback()
        logger.error(f"Error deleting review: {str(e)}")
        return jsonify({'message': f'Error: {str(e)}'}), 500
