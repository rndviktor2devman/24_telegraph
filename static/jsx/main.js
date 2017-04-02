var PostsList = React.createClass({
    // sets initial state
    getInitialState: function(){
      return {
          posts: [],
          searchString: ''
      };
    },

    componentDidMount: function () {
        var cached_search = localStorage.getItem('search_string');
        if(cached_search){
            this.setState({searchString: cached_search});
        }
        sendUrl = '/get_posts';
        $.ajax({
          url: sendUrl,
          dataType: 'json',
          cache: false,
          success: function(data) {
              var search_data = data;
              search_data.forEach(function (item) {
                  item.link = window.location.origin + '/' + item.link;
              });
              this.setState({posts: search_data});
          }.bind(this),
          error: function(xhr, status, err) {
            console.error(this.props.url, status, err.toString());
          }.bind(this)
        });
    },

    handleChange: function(event){
        var search_string = event.target.value;
        localStorage.setItem('search_string', search_string);
        this.setState({searchString: search_string});
    },

    render: function(){
        var posts = this.state.posts;
        var searchString = this.state.searchString.trim().toLowerCase();

        if(searchString.length > 0){
            posts = posts.filter(function (post) {
                return post.title.toLowerCase().match( searchString );
            })
        }

        return(
            <div>
                <input type="text" value={this.state.searchString} onChange={this.handleChange} placeholder="Поиск"/>
                <ul>
                    {
                        posts.map(function (post) {
                            return <li><a href={post.link}>{post.title}</a></li>
                    })}
                </ul>
            </div>
        )
    },

});

var PostsEditor = React.createClass({
    getInitialState: function(){
      return {
          title: '',
          author:'',
          story: '',
          pristinecontent: '',
          passphrase: '',
          editMode: false,
          linkText: '',
          searchable: true,
          pristine: true
      };
    },

    componentDidMount: function () {
        if(document.cookie.indexOf('id=') == -1){
            document.cookie = "id=" + Date.now().toString(32);
        }

        var sendUrl = document.URL;
        if(window.location.pathname == '/')
        {
            sendUrl += 'empty_post'
        }
        else
        {
            if(sendUrl.substr(sendUrl.length - 1) !== '/')
            {
                sendUrl += '/'
            }
            sendUrl += 'select_data'
        }

        $.ajax({
          url: sendUrl,
          dataType: 'json',
          cache: false,
          success: function(data) {
              var link_text = '';
              if(data.linkText.length > 0){
                  link_text = window.location.origin + '/' + data.linkText;
              }
              var content = data.title + data.author + data.story + data.searchable;
              this.setState({
                  title: data.title,
                  author: data.author,
                  story: data.story,
                  pristinecontent: content,
                  passphrase: '',
                  editMode: data.edit_mode,
                  linkText: link_text,
                  searchable: data.searchable,
                  pristine: true
              })
          }.bind(this),
          error: function(xhr, status, err) {
            console.error(this.props.url, status, err.toString());
          }.bind(this)
        });
    },

    submitPost: function () {
        if(document.cookie.indexOf('id=') == -1){
            document.cookie = "id=" + Date.now().toString(32);
        }
        var sendUrl = document.URL + 'post';
        $.ajax({
          url: sendUrl,
          type: 'POST',
          data: JSON.stringify(this.state),
          contentType: 'application/json;charset=UTF-8',
          success: function(data) {
              var link_text = '/';
              if(data.linkText.length > 0){
                  link_text = window.location.origin + '/' + data.linkText;
              }
              window.location.href = link_text
          }.bind(this),
          error: function(xhr, status, err) {
            console.error(this.props.url, status, err.toString());
          }.bind(this)
        });
    },

    deletePost: function () {
        var sendUrl = document.URL;
        if(sendUrl.substr(sendUrl.length - 1) !== '/')
        {
            sendUrl += '/'
        }
        sendUrl += 'delete';
        $.ajax({
          url: sendUrl,
          type: 'POST',
          data: JSON.stringify(this.state),
          contentType: 'application/json;charset=UTF-8',
          success: function(data) {
              window.location.href = '/';
          }.bind(this),
          error: function(xhr, status, err) {
              if(xhr.status == 404){
                  window.location.href = '/404_page'
              } else if(xhr.status == 403){
                  window.location.href = '/403_page'
              }
          }.bind(this)
        });
    },

    updatePost: function () {
        var sendUrl = document.URL;
        if(sendUrl.substr(sendUrl.length - 1) !== '/')
        {
            sendUrl += '/'
        }
        sendUrl = sendUrl + 'update';
        if(document.cookie.indexOf('id=') == -1){
            document.cookie = "id=" + Date.now().toString(32);
        }
        $.ajax({
          url: sendUrl,
          type: 'POST',
          data: JSON.stringify(this.state),
          contentType: 'application/json;charset=UTF-8',
          success: function(data) {
              var link_text = '';
              if(data.linkText.length > 0){
                  link_text = window.location.origin + '/' + data.linkText;
              }
              window.location.href = link_text;
          }.bind(this),
          error: function(xhr, status, err) {
              if(xhr.status == 404){
                  window.location.href = '/404_page'
              }else if(xhr.status == 403){
                  window.location.href = '/403_page'
              }
          }.bind(this)
        });
    },

    newPost: function () {
        window.location.href = '/'
    },

    handlePassphrase: function(event){
        if(!this.state.editMode || this.state.linkText.length == 0){
            var passphrase = {'passphrase': event.target.value};
            if(this.state.linkText.length !== 0){
                var sendUrl = document.URL;
                if(sendUrl.substr(sendUrl.length - 1) !== '/')
                {
                    sendUrl += '/'
                }
                sendUrl += 'check_passphrase';
                $.ajax({
                  url: sendUrl,
                  type: 'POST',
                  data: JSON.stringify(passphrase),
                  contentType: 'application/json;charset=UTF-8',
                  success: function(data) {
                      this.setState({editMode: true, pristine: true});
                  }.bind(this),
                  error: function(xhr, status, err) {
                      if(xhr.status == 403){
                          this.setState({editMode: false, pristine: true});
                      }
                  }.bind(this)
                });
            }

            this.setState({passphrase:passphrase.passphrase});
        }
    },

    handleTitle: function(event){
        if(this.state.editMode){
            var titletext = event.target.value;
            this.setState({title: titletext});
            this.checkContent(1, titletext);
        }
    },

    handleAuthor: function (event) {
        if(this.state.editMode){
            var authortext = event.target.value;
            this.setState({author: authortext});
            this.checkContent(2, authortext);
        }
    },

    handleStory: function (event) {
        if(this.state.editMode){
            var storytext = event.target.value;
            this.setState({story: storytext});
            this.checkContent(3, storytext);
        }
    },

    handleSearchable: function (event) {
        const target = event.target;
        const value =  target.checked;
        this.setState({ searchable: value});
        this.checkContent(4, value);
    },

    checkContent: function (number, text) {
        var content = '';
        if(number === 1)
        {
            content += text;
        }
        else
        {
            content += this.state.title;
        }
        if(number === 2)
        {
            content += text;
        }
        else
        {
            content += this.state.author;
        }
        if(number === 3)
        {
            content += text;
        }
        else
        {
            content += this.state.story;
        }
        if(number === 4)
        {
            content += text;
        }
        else
        {
            content += this.state.searchable;
        }
        this.setState({pristine: content == this.state.pristinecontent});
    },

    render: function () {
        var editMode = this.state.editMode;
        var linkText = this.state.linkText;
        var titleLength = this.state.title.length;
        return(
            <div>
                {editMode?(
                    <div>
                        <div className="form-group">
                            <input className="form-control" placeholder="Заголовок(обязателен)" value={this.state.title} onChange={this.handleTitle}/>
                        </div>
                        <div className="form-group">
                            <input className="form-control"  placeholder="Подпись" value={this.state.author} onChange={this.handleAuthor}/>
                        </div>
                        <div className="form-group">
                          <textarea className="form-control"  rows="10" placeholder="Ваша история" value={this.state.story} onChange={this.handleStory}/>
                        </div>
                    </div>
                ):(
                <div>
                    <div className="form-group">
                        <h1>Название: {this.state.title}</h1>
                        <h3>Автор: {this.state.author}</h3>
                    </div>
                    <div className="form-group">
                        <textarea className="form-control non-resize-text-area" rows="10" value={this.state.story}/>
                    </div>
                </div>
                )}
                <div className="form-group">
                    <input name="passphrase" className="form-control" type="password" onChange={this.handlePassphrase} placeholder="Пароль для редактирования(на случай утери cookies)" value={this.state.passphrase}/>
                </div>
                {linkText.length > 0 ?(
                <div className="form-group">
                    <h3><a href={linkText}>{linkText}</a></h3>
                </div>
                ):(
                <div>
                    <div className="form-group">
                        <label className="form-control">Доступен для поиска: <input type="checkbox"  checked={this.state.searchable} onChange={this.handleSearchable} /></label>
                    </div>
                    <div className="form-group">
                        <button className="btn btn-primary" disabled={titleLength == 0} onClick={this.submitPost} type="submit">Опубликовать</button>
                    </div>
                </div>
                )}
                {editMode && linkText.length > 0 ?(
                <div>
                    <div className="form-group">
                        <label className="form-control">Доступен для поиска: <input type="checkbox"  checked={this.state.searchable} onChange={this.handleSearchable}/></label>
                    </div>
                    <div className="form-group">
                        <div className="col-xs-2">
                            <button className="btn btn-primary" disabled={(titleLength == 0) || this.state.pristine} onClick={this.updatePost}>Обновить</button>
                        </div>
                        <div className="col-xs-2">
                            <button className="btn btn-primary" onClick={this.newPost}>Новый</button>
                        </div>
                        <div className="col-xs-2">
                            <button className="btn remove-button" onClick={this.deletePost}>Удалить</button>
                        </div>
                    </div>
                </div>
                ):(
                <div></div>
                )}
            </div>
        )
    }
});

ReactDOM.render(
    <PostsList/>,
    document.getElementById('search_panel')
);

ReactDOM.render(
    <PostsEditor/>,
    document.getElementById('content_panel')
);