from datetime import datetime
from server import app
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash
import string
import random
import uuid

db = SQLAlchemy(app)


def uuid_gen():
    return str(uuid.uuid4())


class Post(db.Model):
    id = db.Column(db.String, primary_key=True, default=uuid_gen)
    author = db.Column(db.String(120))
    title = db.Column(db.String(120))
    text = db.Column(db.Text)
    update_time = db.Column(db.DateTime)
    passphrase = db.Column(db.String(120))
    cookie_id = db.Column(db.String(10))
    searchable = db.Column(db.Boolean, unique=False, default=False)

    def __init__(self, author, title, text, cookie_id, searchable,
                 passphrase=None, submit_time=None):
        self.author = author
        self.title = title
        self.text = text
        if submit_time is None:
            submit_time = datetime.utcnow()
        self.update_time = submit_time
        if passphrase is None or not passphrase.strip():
            passphrase = id_generator()
        self.passphrase = generate_password_hash(passphrase)
        self.cookie_id = cookie_id
        self.searchable = searchable


def id_generator(size=20, chars=string.ascii_uppercase + string.digits):
    return ''.join(random.choice(chars) for _ in range(size))
