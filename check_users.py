import sys
import os
sys.path.append('server')
from models import db, User
from config import Config
from flask import Flask

app = Flask(__name__)
app.config.from_object(Config)
db.init_app(app)

with app.app_context():
    users = User.query.all()
    for u in users:
        print(f"ID: {u.id}, Name: {u.name}, Email: {u.email}, Profile Picture: {u.profile_picture}")
