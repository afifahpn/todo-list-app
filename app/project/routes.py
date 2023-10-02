from flask import request, jsonify
from app.extension import db
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.project import projectbp
from app.models.project import Projects

@projectbp.route('/', methods=['GET'], strict_slashes = False)
@jwt_required(locations=['headers'])
def get_all_project():
    current_user_id = get_jwt_identity()

    projects = Projects.query.filter_by(user_id=current_user_id).order_by(Projects.project_id.desc())

    result = []
    for project in projects:
        result.append(project.serialize())

    return jsonify({
        "success": True,
        "data": result
    }),200

# get project by id
@projectbp.route('<int:project_id>', methods=['GET'], strict_slashes = False)
@jwt_required(locations=['headers'])
def get_project_by_id(project_id):
    current_user_id = get_jwt_identity()

    projects = Projects.query.filter_by(project_id=project_id).first()

    project =projects.serialize()

    return jsonify({
        "success": True,
        "data": project
    }),200

# create project
@projectbp.route('/', methods=['POST'], strict_slashes=False)
@jwt_required(locations=['headers'])
def create_project():
    data = request.get_json()
    title = data['title']
    description = data['description']
    # langsung lempar user id dari jwt
    user_id = get_jwt_identity()

    if not title or not description:
        return jsonify({
            "message":'Incomplete data'
        }),422
    
    new_project = Projects(title = title, description = description, user_id = user_id)

    db.session.add(new_project)
    db.session.commit()

    return jsonify({
        "success":True, 
        "message": new_project.serialize()
    }),200

# update project
@projectbp.route('<int:project_id>', methods = ['PUT'], strict_slashes = False)
@jwt_required(locations=['headers'])
def update_project(project_id):
    current_user_id = get_jwt_identity()
    data = request.get_json()
    title = data['title']
    description = data['description']
    # langsung lempar user id dari jwt

    project = Projects.query.filter_by(project_id=project_id).first()

    if not project:
        return jsonify({
            "message": "Project Not Found"
        }),404
    
    if not title or not description:
        return jsonify({
            "message":'Incomplete data'
        }),422
    
    if current_user_id != project.user_id:
        return jsonify({
            "message": "Unauthorized Action"
        }),422

    project.title = title
    project.description = description

    db.session.commit()

    return jsonify({
        "success": True,
        "message": "Project Successfully Updated"
    })


@projectbp.route('<int:project_id>', methods=['DELETE'],strict_slashes = False)
@jwt_required(locations=['headers'])
def delete_project(project_id):
    current_user_id = get_jwt_identity()
    project = Projects.query.filter_by(project_id=project_id).first()
    if not project:
        return jsonify({
            "message": "Project Not Found"
        }),404
    
    if current_user_id != project.user_id:
        return jsonify({
            "message": "Unauthorized action"
        }),422
    
    db.session.delete(project)
    db.session.commit()
    
    return jsonify({
        "success": True,
        "message": "Project Successfully Deleted"
    })

