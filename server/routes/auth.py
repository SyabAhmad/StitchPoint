from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import create_access_token, create_refresh_token, jwt_required, get_jwt_identity
from models import db, User

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/signup', methods=['POST'])
def signup():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    name = data.get('name')

    if not email or not password:
        return jsonify({'message': 'Email and password are required'}), 400

    if User.query.filter_by(email=email).first():
        return jsonify({'message': 'User already exists'}), 400

    hashed_password = generate_password_hash(password)
    # Remove auto super_admin assignment; managers are created via dashboard only
    role = 'customer'
    new_user = User(email=email, password_hash=hashed_password, name=name, role=role)
    db.session.add(new_user)
    db.session.commit()

    return jsonify({'message': 'User created successfully'}), 201

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({'message': 'Email and password are required'}), 400

    user = User.query.filter_by(email=email).first()
    if not user or not check_password_hash(user.password_hash, password):
        return jsonify({'message': 'Invalid credentials'}), 401

    # Ensure the JWT "sub"/identity is a string to satisfy PyJWT validation
    access_token = create_access_token(identity=str(user.id))
    refresh_token = create_refresh_token(identity=str(user.id))

    # Prepare user payload; include store details for managers so the frontend
    # can filter products by store_name/store_address without an extra request.
    user_payload = {
        'id': user.id,
        'email': user.email,
        'name': user.name,
        'role': user.role,
    }

    # If the user has an associated store, include simple store fields
    try:
        if hasattr(user, 'store') and user.store:
            user_payload['store_id'] = user.store.id
            user_payload['store_name'] = user.store.name
            user_payload['store_address'] = user.store.address
    except Exception:
        # Be defensive: if lazy-loaded relationship fails, skip enriching payload
        pass

    return jsonify({
        'access_token': access_token,
        'refresh_token': refresh_token,
        'user': user_payload
    }), 200



@auth_bp.route('/refresh', methods=['POST'])
@jwt_required(refresh=True)
def refresh():
    # Issue a new access token using a valid refresh token
    identity = get_jwt_identity()
    # identity stored as string; return access token with same identity
    new_access = create_access_token(identity=identity)
    return jsonify({'access_token': new_access}), 200
