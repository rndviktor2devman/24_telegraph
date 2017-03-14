from flask import Flask, render_template, request
from posts import Post, db
import json
from flask_socketio import SocketIO, emit

app = Flask(__name__)
app.config.from_object('config')
db.init_app(app)
socketio = SocketIO(app)


@app.route('/')
@app.route('/<post_id>', methods=['GET'])
def form(post_id=None):
    if post_id is None:
        return render_template('form.html')
    else:
        post = Post.query.filter_by(post_id=post_id).first()
        if post is not None:
            return render_template('form.html')
        else:
            return render_template('404.html'), 404


@app.errorhandler(404)
def page_not_found(error):
    return 'This page does not exist', 404


@app.route('/empty_post')
def empty_post():
    response_data = {
        'title': '',
        'author': '',
        'story': '',
        'passphrase': '',
        'editMode': True,
        'linkText': '',
        'searchable': True
    }
    return json.dumps({'status': 'ok', 'data': response_data})


@app.route('/get_posts')
def get_all_posts():
    posts = Post.query.filter_by(searchable=1).all()
    posts_data = []
    for post in posts:
        post_data = {'title': post.title, 'link': post.post_id}
        posts_data.append(post_data)
    return json.dumps({'status': 'ok', 'data': posts_data})


@app.route('/<post_id>/select_data', methods=['GET'])
def select_post_data(post_id):
    post = Post.query.filter_by(post_id=post_id).first()
    editMode = False
    if request.cookies is not None and 'id' in request.cookies:
        editMode = post.cookie_id == request.cookies['id']
    response_data = {
        'title': post.title,
        'author': post.author,
        'story': post.text,
        'editMode': editMode,
        'linkText': post.post_id,
        'searchable': post.searchable
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
    searchable = request.json['searchable']
    post = Post(author, title, story, cookies_id, searchable, passphrase)
    db.session.add(post)
    db.session.commit()
    post_id = post.post_id
    print('post_id=%s' % post_id)
    response_data = {
        'linkText': post_id
    }
    if searchable:
        print('should be refresh called')
    return json.dumps({'status': 'ok', 'data': response_data})


@app.route('/<post_id>/update', methods=['POST'])
def edit_post(post_id):
    response_data = {
        'linkText': post_id
    }
    old_post = Post.query.filter_by(post_id=post_id).first()
    if old_post is not None:
        old_searchable = old_post.searchable
        old_post.cookies_id = request.cookies['id']
        old_post.title = request.json['title']
        old_post.author = request.json['author']
        old_post.story = request.json['story']
        old_post.passphrase = request.json['passphrase']
        old_post.searchable = request.json['searchable']
        db.session.commit()

    if old_searchable or old_searchable != request.json['searchable']:
        print('should be refresh called')
    return json.dumps({'status': 'ok', 'data': response_data})


if __name__ == "__main__":
    app.run(host='0.0.0.0')
