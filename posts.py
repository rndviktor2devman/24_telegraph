from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()


class Post(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    author = db.Column(db.String(120))
    title = db.Column(db.String(120))
    text = db.Column(db.Text)
    update_date = db.Column(db.DateTime)

    def __init__(self, author, title, text, date=None):
        self.author = author
        self.title = title
        self.text = text
        if date is None:
            date = datetime.utcnow()
        self.update_date = date
