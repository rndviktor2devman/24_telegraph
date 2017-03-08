//var socket = io.connect('http://' + document.domain + ':' + location.port);
var PostsList = React.createClass({
    // sets initial state
    getInitialState: function(){
      return { searchString: '' };
    },

    handleChange: function(event){
        this.setState({searchString:event.target.value})
    },

    render: function(){
        var posts = this.props.items;
        var searchString = this.state.searchString.trim().toLowerCase();

        if(searchString.length > 0){
            posts = posts.filter(function (post) {
                return post.name.toLowerCase().match( searchString );
            })
        }

        return(
            <div>
                <input type="text" value={this.state.searchString} onChange={this.handleChange} placeholder="Поиск"/>
                <ul>
                    {posts.map(function (post) {
                        return <li>{post.name}</li>
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
          editMode: true
      };
    },

    render: function () {
        return(
            <div>
                <div className="form-group">
                  <input className="form-control" placeholder="Заголовок"/>
                </div>
                <div className="form-group">
                  <input className="form-control" placeholder="Подпись"/>
                </div>
                <div className="form-group">
                  <textarea className="form-control" rows="10" placeholder="Ваша история"/>
                </div>
                <div className="form-group">
                    <input name="passphrase" className="form-control" type="password" placeholder="Пароль для редактирования"/>
                </div>
                <div className="form-group">
                  <button className="btn btn-primary" type="submit">Опубликовать</button>
                </div>
            </div>
        )
    }
});

var posts = [];

ReactDOM.render(
    <PostsList items={ posts }/>,
    document.getElementById('search_panel')
);

ReactDOM.render(
    <PostsEditor/>,
    document.getElementById('content_panel')
);