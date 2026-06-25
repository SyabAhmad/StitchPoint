from models import db, User
from app import app

with app.app_context():
    user = User.query.filter_by(email='mentee@naqsh.com').first()
    if user:
        user.role = 'super_admin'
        db.session.commit()
        print('Updated mentee@naqsh.com to super_admin')
    else:
        print('User mentee@naqsh.com not found')
