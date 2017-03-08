(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
//var socket = io.connect('http://' + document.domain + ':' + location.port);
var PostsList = React.createClass({displayName: "PostsList",
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
          editMode: true
      };
    },

    render: function () {
        return(
            React.createElement("div", null, 
                React.createElement("div", {className: "form-group"}, 
                  React.createElement("input", {className: "form-control", placeholder: "Заголовок"})
                ), 
                React.createElement("div", {className: "form-group"}, 
                  React.createElement("input", {className: "form-control", placeholder: "Подпись"})
                ), 
                React.createElement("div", {className: "form-group"}, 
                  React.createElement("textarea", {className: "form-control", rows: "10", placeholder: "Ваша история"})
                ), 
                React.createElement("div", {className: "form-group"}, 
                    React.createElement("input", {name: "passphrase", className: "form-control", type: "password", placeholder: "Пароль для редактирования"})
                ), 
                React.createElement("div", {className: "form-group"}, 
                  React.createElement("button", {className: "btn btn-primary", type: "submit"}, "Опубликовать")
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
