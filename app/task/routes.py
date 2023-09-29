from flask import request, jsonify
from app.extension import db
from flask_jwt_extended import jwt_required, get_jwt_identity

from app.task import taskbp
from app.models.task import Tasks
from app.models.project import Projects

@taskbp.route('/', methods=['GET'], strict_slashes = False)
@jwt_required(locations=['headers'])
def get_all_tasks():
    limit = request.args.get('limit', 10)
    current_user_id = get_jwt_identity()

    if type(limit) is not int:
        return jsonify({
            "message": "Invalid Parameter"
        }), 400
    
    tasks = db.session.query(Tasks, Projects).join(Projects). \
        filter(Tasks.user_id == current_user_id). \
        limit(limit)

    result = []
    for task, project in tasks:
        task_dict = {
            "task_id":task.task_id,
            "title": task.title,
            "description": task.description,
            "status": task.status,
            "user_id": task.user_id,
            "project_id": project.project_id,
            "project_title": project.title
        }
        result.append(task_dict)

    return jsonify({
        "success": True,
        "data": result
    }),200

# get task by id
@taskbp.route('<int:task_id>', methods=['GET'], strict_slashes = False)
@jwt_required(locations=['headers'])
def get_task_by_id(task_id):
    # task = Tasks.query.filter_by(task_id=task_id).first()
    task = db.session.query(Tasks, Projects).join(Projects). \
        filter(Tasks.task_id == task_id)
    
    if not task:
        return jsonify({
            "message": "Task Not Found"
        }),404

    current_user_id = get_jwt_identity()

    for task, project in task:
        task_dict = {
            "task_id":task.task_id,
            "title": task.title,
            "description": task.description,
            "status": task.status,
            "user_id": task.user_id,
            "project_id": project.project_id,
            "project_title": project.title
        }

    return jsonify({
        "success": True,
        "data": task_dict
    }),200

# get task by project
@taskbp.route('project/<int:project_id>', methods=['GET'], strict_slashes = False)
@jwt_required(locations=['headers'])
def get_task_by_project(project_id):
    # task = Tasks.query.filter_by(task_id=task_id).first()
    task = db.session.query(Tasks, Projects).join(Projects). \
        filter(Tasks.project_id == project_id)
    
    if not task:
        return jsonify({
            "message": "Task Not Found"
        }),404

    current_user_id = get_jwt_identity()

    result = []
    for task, project in task:
        task_dict = {
            "task_id":task.task_id,
            "title": task.title,
            "description": task.description,
            "status": task.status,
            "user_id": task.user_id,
            "project_id": project.project_id,
            "project_title": project.title
        }
        result.append(task_dict)


    return jsonify({
        "success": True,
        "data": result
    }),200

# create task
@taskbp.route('/', methods=['POST'], strict_slashes=False)
@jwt_required(locations=['headers'])
def create_task():
    data = request.get_json()
    title = data['title']
    description = data['description']
    project_id = data['project_id']
    # langsung lempar user id dari jwt
    user_id = get_jwt_identity()

    if not title or not description or not project_id:
        return jsonify({
            "message":'Incomplete data'
        }),422
    
    new_task = Tasks(title = title, description = description, project_id = project_id, user_id = user_id)

    db.session.add(new_task)
    db.session.commit()

    return jsonify({
        "success":True, 
        "message": new_task.serialize()
    }),200

# api baru untuk mengupdate data task
@taskbp.route('<int:task_id>', methods = ['PUT'], strict_slashes = False)
@jwt_required(locations=['headers'])
def update_task(task_id):
    current_user_id = get_jwt_identity()
    data = request.get_json()
    title = data['title']
    description = data['description']
    project_id = data['project_id']
    # langsung lempar user id dari jwt

    task = Tasks.query.filter_by(task_id=task_id).first()

    if not task:
        return jsonify({
            "message": "Task Not Found"
        }),404
    
    if not title or not description or not project_id:
        return jsonify({
            "message":'Incomplete data'
        }),422
    
    if current_user_id != task.user_id:
        return jsonify({
            "message": "Unauthorized Action"
        }),422

    task.title = title
    task.description = description
    task.project_id = project_id
    # task.user_id = user_id

    db.session.commit()

    return jsonify({
        "success": True,
        "message": "Task Successfully Updated"
    })

# api baru untuk mengupdate status task
@taskbp.route('/status/<int:task_id>', methods=["PUT"], strict_slashes = False)
@jwt_required(locations=["headers"])
def update_status(task_id):
    current_user_id = get_jwt_identity()
    data = request.get_json()
    status = data.get('status')

    task = Tasks.query.filter_by(task_id=task_id).first()

    if not task:
        return jsonify({
            "message": "Task Not Found"
        }),404
    
    if current_user_id != task.user_id:
        return jsonify({
            "message": "Unauthorized Action"
        }),422
    
    task.status = status
    db.session.commit()

    return jsonify({
        "success": True,
        "message": "Status Successfully Updated"
    })


@taskbp.route('<int:task_id>', methods=['DELETE'],strict_slashes = False)
@jwt_required(locations=['headers'])
def delete_task(task_id):
    current_user_id = get_jwt_identity()
    task = Tasks.query.filter_by(task_id=task_id).first()
    if not task:
        return jsonify({
            "message": "Task Not Found"
        }),404
    
    if current_user_id != task.user_id:
        return jsonify({
            "message": "Unauthorized action"
        }),422
    
    db.session.delete(task)
    db.session.commit()
    
    return jsonify({
        "success": True,
        "message": "Task Successfully Deleted"
    })

