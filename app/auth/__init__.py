from flask import Flask, Blueprint, request, jsonify
import os  # untuk menghandle direktori
import json
from flask_cors import CORS


# blueprint untuk simplify aplikasi menjadi modul modul
authbp = Blueprint("auth", __name__)
CORS(authbp)


from app.auth import routes