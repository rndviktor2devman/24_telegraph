from flask import Flask, render_template
from posts import Post, db
import json
from flask_socketio import SocketIO, emit

app = Flask(__name__)
app.config.from_object('config')
db.init_app(app)
socketio = SocketIO(app)


@app.route('/')
def form():
    return render_template('form.html')

if __name__ == "__main__":
    app.run(host='0.0.0.0')
