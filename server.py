from flask import Flask, render_template, request
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


@app.route('/empty_post')
def empty_post():
    response_data = {
        'title': '',
        'author': '',
        'story': '',
        'passphrase': '',
        'editMode': True,
    }
    return json.dumps({'status': 'ok', 'data': response_data})


@app.route('/get_posts')
def get_all_posts():
    posts = Post.query.all()
    posts_data = []
    for post in posts:
        post_data = {'title': post.title, 'link': post.id}
        posts_data.append(post_data)
    return json.dumps({'status': 'ok', 'data': posts_data})


@app.route('/<post_id>', methods=['GET'])
def select_post(post_id):
    return render_template('form.html')


@app.route('/<post_id>/select_data', methods=['GET'])
def select_post_data(post_id):
    post = Post.query.filter_by(id=post_id).first()
    editMode = False
    if request.cookies is not None and 'id' in request.cookies:
        editMode = post.cookie_id == request.cookies['id']
    response_data = {
        'title': post.title,
        'author': post.author,
        'story': post.text,
        'editMode': editMode
    }
    return json.dumps({'status': 'ok', 'data': response_data})


@app.route('/post', methods=['POST'])
def submit_post():
    print('empty post creation')
    print(request.json)
    cookies_id = request.cookies['id']
    title = request.json['title']
    author = request.json['author']
    story = request.json['story']
    passphrase = request.json['passphrase']
    post = Post(author, title, story, cookies_id, passphrase)
    db.session.add(post)
    db.session.commit()
    post_id = post.id
    print('post_id=%d' % post_id)
    return json.dumps({'status': 'ok', 'post_id': post_id})


if __name__ == "__main__":
    app.run(host='0.0.0.0')
