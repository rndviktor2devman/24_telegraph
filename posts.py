from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
import string
import random

db = SQLAlchemy()


class Post(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    author = db.Column(db.String(120))
    title = db.Column(db.String(120))
    text = db.Column(db.Text)
    update_date = db.Column(db.DateTime)
    passphrase = db.Column(db.String(80))
    cookie_id = db.Column(db.String(10))

    def __init__(self, author, title, text, cookie_id, passphrase=None, date=None):
        self.author = author
        self.title = title
        self.text = text
        if date is None:
            date = datetime.utcnow()
        self.update_date = date
        if passphrase is None or not passphrase.strip():
            passphrase = id_generator()
        self.passphrase = passphrase
        self.cookie_id = cookie_id


def id_generator(size=20, chars=string.ascii_uppercase + string.digits):
    return ''.join(random.choice(chars) for _ in range(size))
