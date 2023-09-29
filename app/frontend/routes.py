from app.frontend import frontendbp
from flask import render_template
from flask_jwt_extended import jwt_required,get_jwt_identity

@frontendbp.route("", strict_slashes = False)
def home():
    return render_template("/tasks/index.html")

@frontendbp.route("project/", strict_slashes = False)
def project():
    return render_template("/project/index.html")

@frontendbp.route("auth/login", strict_slashes=False)
def login():
    return render_template("/auth/login.html")

@frontendbp.route("auth/register", strict_slashes=False)
def register():
    return render_template("/auth/register.html")