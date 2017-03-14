//var socket = io.connect('http://' + document.domain + ':' + location.port);
var PostsList = React.createClass({
    // sets initial state
    getInitialState: function(){
      return {
          posts: [],
          searchString: ''
      };
    },

    componentDidMount: function () {
        sendUrl = '/get_posts';
        $.ajax({
          url: sendUrl,
          dataType: 'json',
          cache: false,
          success: function(data) {
              var search_data = data.data;
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
        this.setState({searchString:event.target.value})
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
              if(data.data.linkText.length > 0){
                  link_text = window.location.origin + '/' + data.data.linkText;
              }
              this.setState({
                  title: data.data.title,
                  author: data.data.author,
                  story: data.data.story,
                  passphrase: '',
                  editMode: data.data.editMode,
                  linkText: link_text,
                  searchable: data.data.searchable,
                  pristine: true
              })
          }.bind(this),
          error: function(xhr, status, err) {
            console.error(this.props.url, status, err.toString());
          }.bind(this)
        });
    },

    submitPost: function () {
        var sendUrl = this.props.url;
        if(!sendUrl)
        {
            sendUrl = document.URL
        }
        sendUrl = sendUrl + 'post';
        $.ajax({
          url: sendUrl,
          type: 'POST',
          data: JSON.stringify(this.state),
          contentType: 'application/json;charset=UTF-8',
          success: function(data) {
              var json = $.parseJSON(data);
              var link_text = '';
              if(json.data.linkText.length > 0){
                  link_text = window.location.origin + '/' + json.data.linkText;
              }
              this.setState({linkText: link_text, editMode: true, pristine: true});
          }.bind(this),
          error: function(xhr, status, err) {
            console.error(this.props.url, status, err.toString());
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
        document.cookie = "id=" + Date.now().toString(32);
        $.ajax({
          url: sendUrl,
          type: 'POST',
          data: JSON.stringify(this.state),
          contentType: 'application/json;charset=UTF-8',
          success: function(data) {
              var json = $.parseJSON(data);
              var link_text = '';
              if(json.data.linkText.length > 0){
                  link_text = window.location.origin + '/' + json.data.linkText;
              }
              this.setState({linkText: link_text, editMode: true, pristine: true});
          }.bind(this),
          error: function(xhr, status, err) {
            console.error(this.props.url, status, err.toString());
          }.bind(this)
        });
    },

    handlePassphrase: function(event){
        this.setState({passphrase:event.target.value, pristine: false})
    },

    handleTitle: function(event){
        if(this.state.editMode){
            this.setState({title:event.target.value, pristine: false})
        }
    },

    handleAuthor: function (event) {
        if(this.state.editMode){
            this.setState({author:event.target.value, pristine: false})
        }
    },

    handleStory: function (event) {
        if(this.state.editMode){
            this.setState({story:event.target.value, pristine: false})
        }
    },

    handleSearchable: function (event) {
        const target = event.target;
        const value =  target.checked;
        this.setState({
          searchable: value
        });
    },

    render: function () {
        var editMode = this.state.editMode;
        var linkText = this.state.linkText;
        return(
            <div>
                {editMode?(
                    <div>
                        <div className="form-group">
                            <input className="form-control" placeholder="Заголовок" value={this.state.title} onChange={this.handleTitle}/>
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
                        <button className="btn btn-primary" disabled={!this.state.editMode} onClick={this.submitPost} type="submit">Опубликовать</button>
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
                            <button className="btn btn-primary" disabled={this.state.pristine} onClick={this.updatePost}>Обновить</button>
                        </div>
                        <div className="col-xs-2">
                            <button className="btn remove-button" >Удалить</button>
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