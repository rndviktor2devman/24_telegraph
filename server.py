from flask import Flask, render_template, request, jsonify, abort
from werkzeug.security import check_password_hash

app = Flask(__name__, instance_relative_config=True)

app.config.from_pyfile('config.py')
app.config.from_envvar('APP_CONFIG_FILE')

from posts import Post, db


@app.route('/')
@app.route('/<post_id>', methods=['GET'])
def form(post_id=None):
    if post_id is None:
        return render_template('form.html')
    else:
        post = Post.query.filter_by(id=post_id).first()
        if post is not None:
            return render_template('form.html')
        else:
            return render_template('404.html'), 404


@app.route('/404_page')
def error():
    return render_template('404.html'), 404


@app.route('/403_page')
def error_forbidden():
    return render_template('403.html'), 403


@app.route('/empty_post')
def empty_post():
    response_data = {
        'title': '',
        'author': '',
        'story': '',
        'passphrase': '',
        'edit_mode': True,
        'linkText': '',
        'searchable': True
    }
    return jsonify(response_data)


@app.route('/get_posts')
def get_all_posts():
    posts_data = []
    first_post = Post.query.first()
    if first_post is not None:
        posts = Post.query.filter_by(searchable=True).all()
        for post in posts:
            post_data = {'title': post.title, 'link': post.id}
            posts_data.append(post_data)
    return jsonify(posts_data)


@app.route('/<post_id>/select_data', methods=['GET'])
def select_post_data(post_id):
    post = Post.query.filter_by(id=post_id).first()
    edit_mode = post.cookie_id == request.cookies.get('auth_id')
    response_data = {
        'title': post.title,
        'author': post.author,
        'story': post.text,
        'edit_mode': edit_mode,
        'linkText': post.id,
        'searchable': post.searchable
    }
    return jsonify(response_data)


@app.route('/<post_id>/check_passphrase', methods=['POST'])
def check_passphrase(post_id):
    passphrase = request.json['passphrase']
    post = Post.query.filter_by(id=post_id).first()
    if post is not None and check_password_hash(post.passphrase_hash, passphrase):
        return jsonify()
    else:
        abort(403)


@app.route('/post', methods=['POST'])
def submit_post():
    cookies_id = request.cookies.get('auth_id')
    title = request.json['title']
    author = request.json['author']
    story = request.json['story']
    passphrase = request.json['passphrase']
    searchable = request.json['searchable']
    post = Post(author, title, story, cookies_id, searchable, passphrase)
    db.session.add(post)
    db.session.commit()
    id = post.id
    response_data = {
        'linkText': id
    }
    return jsonify(response_data)


@app.route('/<post_id>/delete', methods=['POST'])
def delete_post(post_id):
    response_data = {
        'linkText': post_id
    }
    old_post = Post.query.filter_by(id=post_id).first()
    if old_post is None:
        abort(404)
    else:
        if check_password_hash(old_post.passphrase_hash, request.json.get('passphrase')) or \
                (request.cookies.get('auth_id') == old_post.cookie_id):
            Post.query.filter_by(id=post_id).delete()
            db.session.commit()
            return jsonify(response_data)
        else:
            abort(403)


@app.route('/<post_id>/update', methods=['POST'])
def edit_post(post_id):
    response_data = {
        'linkText': post_id
    }
    old_post = Post.query.filter_by(id=post_id).first()
    if old_post is None:
        abort(404)
    else:
        if check_password_hash(old_post.passphrase_hash, request.json.get('passphrase')) \
                or (request.cookies.get('auth_id') == old_post.cookie_id):
            old_post.title = request.json['title']
            old_post.author = request.json['author']
            old_post.text = request.json['story']
            old_post.searchable = request.json['searchable']
            db.session.commit()
            return jsonify(response_data)
        else:
            abort(403)


if __name__ == "__main__":
    app.run(host='0.0.0.0')
