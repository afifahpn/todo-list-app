import os
from datetime import timedelta

# untuk mendapatkan current direktori
basedir = os.path.abspath(os.path.dirname(__file__))

# databasenya akan ada di base direktori dengan nama app.db
DB_URI = 'sqlite:///' + os.path.join(basedir, 'app.db')

class Config:
    SECRET_KEY = '1234'
    SQLALCHEMY_DATABASE_URI = DB_URI
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    JWT_TOKEN_LOCATION = ['headers']
    JWT_SECRET_KEY = 'super-secret' 
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(minutes=15)
    JWT_REFRESH_TOKEN_EXPIRES = timedelta(days=30)
    