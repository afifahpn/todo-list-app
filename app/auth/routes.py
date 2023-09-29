from flask import request, jsonify
from app.extension import db,jwt
from flask_jwt_extended import create_access_token, create_refresh_token, jwt_required, get_jwt_identity, get_jwt
from werkzeug.security import generate_password_hash, check_password_hash
from sqlalchemy.exc import IntegrityError

from app.auth import authbp
from app.models.blacklist_token import BlacklistToken
from app.models.user import Users

# Register
@authbp.route('/register',methods=['POST'],strict_slashes=False)
def register():
    # get payload
    data = request.get_json()
    name=data.get('name', None)
    email=data.get('email', None)
    password=generate_password_hash(data.get('password', None))

    # fields are required
    if not name or not email or not password:
        return jsonify({
            "message":"Name or Email or Password are required"
        }),400
    
    # name could not be duplicated
    try:
        db.session.add(Users(name=name, email=email, password=password))
        db.session.commit()
    except IntegrityError: 
        return jsonify({
            "message": f"User {name} already registered"
        }),422
    
    return jsonify({
        "message": "User registration is completed!"
    }),200

# Login
@authbp.route('/login', methods = ['POST'], strict_slashes=False)
def login():
    data = request.get_json()
    email = data.get('email',None)
    password = data.get('password',None)

    # fields are required
    if not email or not password:
        return jsonify({
            "message": "Email or Password is required!"
        }),400

    user = Users.query.filter_by(email=email).first()

    if not user or not check_password_hash(user.password, password):
        return jsonify({
            "message": "Email or Password is invalid!"
        }),422
    
    access_token = create_access_token(identity=user.user_id)
    refresh_token = create_refresh_token(identity=user.user_id)

    return jsonify({
        "message":"Login success!",
        "access_token":access_token,
        "refresh_token":refresh_token 
    }),200

# refresh token
@authbp.route('/refresh', methods=['POST'])
# verify tokens in request
@jwt_required(refresh=True)
def refresh_token():
    user = get_jwt_identity()
    access_token = {
        "access_token": create_access_token(identity=user)
    }

    return jsonify(access_token),200

# Logout
@authbp.route('/logout', methods=['POST'], strict_slashes=False)
@jwt_required(locations=['headers'])
def logout():
    # sebelum logout save token ke blacklist token, kalau sudah masuk ke db auto expired
    raw_jwt = get_jwt()

    jti = raw_jwt.get('jti')
    token = BlacklistToken(jti = jti)

    db.session.add(token)
    db.session.commit()

    return jsonify({'message': "Logout Success!"}),200

# kalau panggil ini, dijalankan setiap request
@jwt.token_in_blocklist_loader
# kalo jwt di validate auto ngecek fungsi ini
def check_if_token_is_revoked(jwt_header, jwt_payload: dict):
    jti = jwt_payload['jti']
    token = BlacklistToken.query.filter_by(jti=jti).first()

    return token is not None