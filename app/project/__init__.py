from flask import Flask, Blueprint, request, jsonify
import os  # untuk menghandle direktori
import json
from flask_cors import CORS


# blueprint untuk simplify aplikasi menjadi modul modul
projectbp = Blueprint("project", __name__)
CORS(projectbp)


from app.project import routes