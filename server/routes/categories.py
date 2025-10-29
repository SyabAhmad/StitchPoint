from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, Category, User

categories_bp = Blueprint('categories', __name__)

@categories_bp.route('/categories', methods=['GET'])
@jwt_required()
def get_categories():
    try:
        user_id = int(get_jwt_identity())
    except (TypeError, ValueError):
        return jsonify({'message': 'Invalid token identity'}), 422
    user = User.query.get(user_id)

    if not user or user.role not in ['manager', 'super_admin']:
        return jsonify({'message': 'Unauthorized'}), 403

    categories = Category.query.all()
    category_list = [{
        'id': category.id,
        'name': category.name,
        'description': category.description,
        'created_at': category.created_at.isoformat(),
        'updated_at': category.updated_at.isoformat()
    } for category in categories]

    return jsonify({'categories': category_list}), 200

@categories_bp.route('/categories', methods=['POST'])
@jwt_required()
def create_category():
    try:
        user_id = int(get_jwt_identity())
    except (TypeError, ValueError):
        return jsonify({'message': 'Invalid token identity'}), 422
    user = User.query.get(user_id)

    if not user or user.role not in ['manager', 'super_admin']:
        return jsonify({'message': 'Unauthorized'}), 403

    data = request.get_json()
    name = data.get('name')
    description = data.get('description')

    if not name:
        return jsonify({'message': 'Name is required'}), 400

    if Category.query.filter_by(name=name).first():
        return jsonify({'message': 'Category with this name already exists'}), 400

    new_category = Category(name=name, description=description)
    db.session.add(new_category)
    db.session.commit()

    return jsonify({'message': 'Category created successfully', 'category': {
        'id': new_category.id,
        'name': new_category.name,
        'description': new_category.description,
        'created_at': new_category.created_at.isoformat(),
        'updated_at': new_category.updated_at.isoformat()
    }}), 201

@categories_bp.route('/categories/<int:category_id>', methods=['PUT'])
@jwt_required()
def update_category(category_id):
    try:
        user_id = int(get_jwt_identity())
    except (TypeError, ValueError):
        return jsonify({'message': 'Invalid token identity'}), 422
    user = User.query.get(user_id)

    if not user or user.role not in ['manager', 'super_admin']:
        return jsonify({'message': 'Unauthorized'}), 403

    category = Category.query.get(category_id)
    if not category:
        return jsonify({'message': 'Category not found'}), 404

    data = request.get_json()
    name = data.get('name')
    description = data.get('description')

    if not name:
        return jsonify({'message': 'Name is required'}), 400

    # Check if another category with the same name exists
    existing_category = Category.query.filter_by(name=name).first()
    if existing_category and existing_category.id != category_id:
        return jsonify({'message': 'Category with this name already exists'}), 400

    category.name = name
    category.description = description
    db.session.commit()

    return jsonify({'message': 'Category updated successfully', 'category': {
        'id': category.id,
        'name': category.name,
        'description': category.description,
        'created_at': category.created_at.isoformat(),
        'updated_at': category.updated_at.isoformat()
    }}), 200

@categories_bp.route('/categories/<int:category_id>', methods=['DELETE'])
@jwt_required()
def delete_category(category_id):
    try:
        user_id = int(get_jwt_identity())
    except (TypeError, ValueError):
        return jsonify({'message': 'Invalid token identity'}), 422
    user = User.query.get(user_id)

    if not user or user.role not in ['manager', 'super_admin']:
        return jsonify({'message': 'Unauthorized'}), 403

    category = Category.query.get(category_id)
    if not category:
        return jsonify({'message': 'Category not found'}), 404

    db.session.delete(category)
    db.session.commit()

    return jsonify({'message': 'Category deleted successfully'}), 200
