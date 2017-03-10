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
          editMode: false
      };
    },

    componentDidMount: function () {
        sendUrl = document.URL;
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
              this.setState({
                  title: data.data.title,
                  author: data.data.author,
                  story: data.data.story,
                  passphrase: '',
                  editMode: data.data.editMode
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
        document.cookie = "id=" + Date.now().toString(32);
        $.ajax({
          url: sendUrl,
          type: 'POST',
          data: JSON.stringify(this.state),
          contentType: 'application/json;charset=UTF-8',
          success: function(data) {
            console.log(data)
          }.bind(this),
          error: function(xhr, status, err) {
            console.error(this.props.url, status, err.toString());
          }.bind(this)
        });
    },

    handlePassphrase: function(event){
        this.setState({passphrase:event.target.value})
    },

    handleTitle: function(event){
        if(this.state.editMode){
            this.setState({title:event.target.value})
        }
    },

    handleAuthor: function (event) {
        if(this.state.editMode){
            this.setState({author:event.target.value})
        }
    },

    handleStory: function (event) {
        if(this.state.editMode){
            this.setState({story:event.target.value})
        }
    },


    render: function () {
        return(
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
                <div className="form-group">
                    <input name="passphrase" className="form-control" type="password" onChange={this.handlePassphrase} placeholder="Пароль для редактирования(на случай утери cookies)" value={this.state.passphrase}/>
                </div>
                <div className="form-group">
                  <button className="btn btn-primary" disabled={!this.state.editMode} onClick={this.submitPost} type="submit">Опубликовать</button>
                </div>
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