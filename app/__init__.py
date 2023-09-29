from flask import Flask, render_template
from app.task import taskbp
from app.user import userbp
from app.auth import authbp
from app.project import projectbp
from app.frontend import frontendbp
from config import Config


from app.extension import db, migrate,jwt

def create_app(config_class = Config):
    app = Flask(__name__)  # membuat instance
    app.config.from_object(config_class)

    # initialize database & migration
    db.init_app(app)
    migrate.init_app(app, db)

    # Initilize JWT
    jwt.init_app(app)

    # Initialize blueprint
    app.register_blueprint(frontendbp,  url_prefix='/')
    app.register_blueprint(taskbp,  url_prefix='/api/tasks')
    app.register_blueprint(userbp,  url_prefix='/api/users')
    app.register_blueprint(authbp,  url_prefix='/api/auth')
    app.register_blueprint(projectbp,  url_prefix='/api/projects')

    return app


