from flask import Flask, Blueprint, request, jsonify
import os  # untuk menghandle direktori
import json
from flask_cors import CORS


# blueprint untuk simplify aplikasi menjadi modul modul
taskbp = Blueprint("task", __name__)
CORS(taskbp)

from app.task import routes