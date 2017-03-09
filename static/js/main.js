(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
//var socket = io.connect('http://' + document.domain + ':' + location.port);
var PostsList = React.createClass({displayName: "PostsList",
    // sets initial state
    getInitialState: function(){
      return { searchString: '' };
    },

    componentDidMount: function () {
        sendUrl = '/get_posts';
        $.ajax({
          url: sendUrl,
          dataType: 'json',
          cache: false,
          success: function(data) {
              var posts_data = data.data
              console.log(posts_data)
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
        var posts = this.props.items;
        var searchString = this.state.searchString.trim().toLowerCase();

        if(searchString.length > 0){
            posts = posts.filter(function (post) {
                return post.name.toLowerCase().match( searchString );
            })
        }

        return(
            React.createElement("div", null, 
                React.createElement("input", {type: "text", value: this.state.searchString, onChange: this.handleChange, placeholder: "Поиск"}), 
                React.createElement("ul", null, 
                    posts.map(function (post) {
                        return React.createElement("li", null, post.name)
                    })
                )
            )
        )
    },

});

var PostsEditor = React.createClass({displayName: "PostsEditor",
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
        console.log(this.props.url);
        console.log(document.URL);
        console.log(document.location.host);
        console.log(window.location.href);
        var sendUrl = this.props.url;
        if(!sendUrl)
        {
            sendUrl = document.URL + 'empty_post'
        }
        else
        {
            sendUrl = sendUrl + '/select_data'
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
            React.createElement("div", null, 
                React.createElement("div", {className: "form-group"}, 
                    React.createElement("input", {className: "form-control", placeholder: "Заголовок", value: this.state.title, onChange: this.handleTitle})
                ), 
                React.createElement("div", {className: "form-group"}, 
                    React.createElement("input", {className: "form-control", placeholder: "Подпись", value: this.state.author, onChange: this.handleAuthor})
                ), 
                React.createElement("div", {className: "form-group"}, 
                  React.createElement("textarea", {className: "form-control", rows: "10", placeholder: "Ваша история", value: this.state.story, onChange: this.handleStory})
                ), 
                React.createElement("div", {className: "form-group"}, 
                    React.createElement("input", {name: "passphrase", className: "form-control", type: "password", onChange: this.handlePassphrase, placeholder: "Пароль для редактирования(на случай утери cookies)", value: this.state.passphrase})
                ), 
                React.createElement("div", {className: "form-group"}, 
                  React.createElement("button", {className: "btn btn-primary", disabled: !this.state.editMode, onClick: this.submitPost, type: "submit"}, "Опубликовать")
                )
            )
        )
    }
});

var posts = [];

ReactDOM.render(
    React.createElement(PostsList, {items:  posts }),
    document.getElementById('search_panel')
);

ReactDOM.render(
    React.createElement(PostsEditor, null),
    document.getElementById('content_panel')
);

},{}]},{},[1]);
