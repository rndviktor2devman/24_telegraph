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
          editMode: false
      };
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
                  <button className="btn btn-primary" disabled={!this.state.editMode} type="submit">Опубликовать</button>
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