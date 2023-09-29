from flask import Blueprint
from flask_cors import CORS

frontendbp = Blueprint('frontend', __name__)
CORS(frontendbp)
from app.frontend import routes