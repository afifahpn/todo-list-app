from flask import Blueprint
import os  # untuk menghandle direktori
import json
# from werkzeug.exceptions import abort

# blueprint untuk simplify aplikasi menjadi modul modul
userbp = Blueprint("user", __name__)

from app.user import routes
