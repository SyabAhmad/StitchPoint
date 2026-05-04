import sys
sys.path.insert(0, './server')

from app import app
from models import db, User

with app.app_context():
    user = User.query.filter_by(email='syedsyabahmadshah@gmail.com').first()
    if user:
        print(f"User: {user.name}")
        print(f"Profile picture: {user.profile_picture}")
    else:
        print("User not found")
