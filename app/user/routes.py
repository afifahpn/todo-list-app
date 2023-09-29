from flask import request, jsonify
from app.extension import db,jwt
from flask_jwt_extended import create_access_token, create_refresh_token, jwt_required, get_jwt_identity, get_jwt
from werkzeug.security import generate_password_hash, check_password_hash
from sqlalchemy.exc import IntegrityError

from app.user import userbp
from app.models.user import Users
from app.models.task import Tasks

@userbp.route('/', methods=['GET'], strict_slashes = False)
# untuk mendapatkan seluruh user
def get_all_users():
    # harus di limit
    limit = request.args.get('limit',10)

    if type(limit) is not int:
        return jsonify({
            "message": "Invalid Parameter"
        }), 400
    
    # menampilkan semua
    users = db.session.execute(
        db.select(Users).limit(limit)
        ).scalars()

    # print(users)
    # langsung akses serialize karena didalem user sudah dibuat fungsi serialize
    result = []
    for user in users:
        result.append(user.serialize())
        
    return jsonify({
        "success": True,
        "data": result
    }), 200

# delete user
@userbp.route('<int:user_id>', methods=['DELETE'], strict_slashes = False)
def delete_user(user_id):
    user = Users.query.filter_by(user_id=user_id).first()

    if not user:
        return jsonify({
            "message": "User Not Found!"
        }),404
    
    db.session.delete(user)
    db.session.commit()

    return jsonify({
        "success": True,
        "message": "User Successfully deleted!"
    }),200


    limit = request.args.get('limit',10)

    if type(limit) is not int:
        return jsonify({
            "message": "Invalid Parameter"
        }),400
    
    tasks = Tasks.query.filter_by(user_id = user_id).all()

    if not tasks:
        return jsonify({
            "message": "Tasks Not Found"
        }),400
    
    result = []
    for task in tasks:
        result.append(task.serialize())

    return jsonify({
        "success": True,
        "data": result
    }),200