(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var PostsList = React.createClass({displayName: "PostsList",
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

        if(posts.length == 0){
            posts.push({title: 'Не найдено', link: '/'})
        }

        return(
            React.createElement("div", null, 
                React.createElement("input", {type: "text", className: "input-field", value: this.state.searchString, onChange: this.handleChange, placeholder: "Поиск"}), 
                React.createElement("ul", {className: "list-item"}, 
                    
                        posts.map(function (post) {
                            return React.createElement("li", null, React.createElement("a", {className: "reference-clear", href: post.link}, post.title))
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
          pristinecontent: '',
          passphrase: '',
          editMode: false,
          passphaseError: false,
          linkText: '',
          searchable: true,
          pristine: true
      };
    },

    checkCookie: function(){
        if(!$.cookie("auth_id")){
            var auth_id = "";
            var possible_chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

            for( var i=0; i < 10; i++ )
                auth_id += possible_chars.charAt(Math.floor(Math.random() * possible_chars.length));
            $.cookie("auth_id", auth_id);
        }
    },

    componentDidMount: function () {
        this.checkCookie();

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
              var content ={
                  'title': data.title,
                  'author': data.author,
                  'story': data.story,
                  'searchable': data.searchable
              };
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
        //at post submission user should have cookie
        this.checkCookie();
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

    handleInputKeyDown: function (event) {
        if(event.keyCode === 13){
            if(this.state.linkText.length !== 0){
                var sendUrl = document.URL;
                var passphrase = {'passphrase': this.state.passphrase};
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
                      this.setState({editMode: true, pristine: true, passphaseError: false});
                  }.bind(this),
                  error: function(xhr, status, err) {
                      if(xhr.status == 403){
                          this.setState({editMode: false, pristine: true, passphaseError: true});
                      }
                  }.bind(this)
                });
            }
        }
    },

    handlePassphrase: function(event){
        if(!this.state.editMode || this.state.linkText.length == 0){
            this.setState({passphrase:event.target.value});
        }
    },

    handleTitle: function(event){
        if(this.state.editMode){
            var titletext = event.target.value;
            this.setState({title: titletext});
            this.verifyPristine();
        }
    },

    handleAuthor: function (event) {
        if(this.state.editMode){
            var authortext = event.target.value;
            this.setState({author: authortext});
            this.verifyPristine();
        }
    },

    handleStory: function (event) {
        if(this.state.editMode){
            var storytext = event.target.value;
            this.setState({story: storytext});
            this.verifyPristine();
        }
    },

    handleSearchable: function (event) {
        const target = event.target;
        const value =  target.checked;
        this.setState({ searchable: value});
        this.verifyPristine();
    },

    verifyPristine: function () {
        var content ={
            'title': this.state.title,
            'author': this.state.author,
            'story': this.state.story,
            'searchable': this.state.searchable
        };
        this.setState({pristine: content == this.state.pristinecontent});
    },

    render: function () {
        var editMode = this.state.editMode;
        var linkText = this.state.linkText;
        var titleLength = this.state.title.length;
        var passphraseError = this.state.passphaseError;
        return(
            React.createElement("div", null, 
                editMode?(
                    React.createElement("div", null, 
                        React.createElement("div", {className: "form-group"}, 
                            React.createElement("input", {className: "form-control input-field", placeholder: "Заголовок(обязателен)", value: this.state.title, onChange: this.handleTitle})
                        ), 
                        React.createElement("div", {className: "form-group"}, 
                            React.createElement("input", {className: "form-control input-field", placeholder: "Подпись", value: this.state.author, onChange: this.handleAuthor})
                        ), 
                        React.createElement("div", {className: "form-group"}, 
                          React.createElement("textarea", {className: "form-control input-field", rows: "10", placeholder: "Ваша история", value: this.state.story, onChange: this.handleStory})
                        )
                    )
                ):(
                React.createElement("div", null, 
                    React.createElement("div", {className: "form-group"}, 
                        React.createElement("h1", {className: "title"}, "Название: ", this.state.title), 
                        React.createElement("h3", {className: "bigger-text"}, "Автор: ", this.state.author)
                    ), 
                    React.createElement("div", {className: "form-group"}, 
                        React.createElement("textarea", {className: "form-control non-resize-text-area", rows: "10", value: this.state.story})
                    )
                )
                ), 
                React.createElement("div", {className: passphraseError? "has-error": "form-group"}, 
                    React.createElement("input", {name: "passphrase", className: "form-control input-field", type: "password", onChange: this.handlePassphrase, onKeyDown: this.handleInputKeyDown, placeholder: "Пароль для редактирования(на случай утери cookies)", value: this.state.passphrase}), 
                    passphraseError? React.createElement("span", {className: "error-field"}, "Несовпадение пароля"): null
                ), 
                linkText.length > 0 ?(
                React.createElement("div", {className: "form-group"}, 
                    React.createElement("h3", {className: "bigger-text"}, React.createElement("a", {className: "reference-clear", href: linkText}, linkText))
                )
                ):(
                React.createElement("div", null, 
                    React.createElement("div", {className: "form-group"}, 
                        React.createElement("label", {className: "form-control"}, "Доступен для поиска: ", React.createElement("input", {type: "checkbox", className: "input-field", checked: this.state.searchable, onChange: this.handleSearchable}))
                    ), 
                    React.createElement("div", {className: "form-group"}, 
                        React.createElement("button", {className: "btn btn-primary", disabled: titleLength == 0, onClick: this.submitPost, type: "submit"}, "Опубликовать")
                    )
                )
                ), 
                editMode && linkText.length > 0 ?(
                React.createElement("div", null, 
                    React.createElement("div", {className: "form-group"}, 
                        React.createElement("label", {className: "form-control"}, "Доступен для поиска: ", React.createElement("input", {type: "checkbox", className: "input-field", checked: this.state.searchable, onChange: this.handleSearchable}))
                    ), 
                    React.createElement("div", {className: "form-group"}, 
                        React.createElement("div", {className: "col-xs-2"}, 
                            React.createElement("button", {className: "btn btn-primary", disabled: (titleLength == 0) || this.state.pristine, onClick: this.updatePost}, "Обновить")
                        ), 
                        React.createElement("div", {className: "col-xs-2"}, 
                            React.createElement("button", {className: "btn btn-primary", onClick: this.newPost}, "Новый")
                        ), 
                        React.createElement("div", {className: "col-xs-2"}, 
                            React.createElement("button", {className: "btn remove-button", onClick: this.deletePost}, "Удалить")
                        )
                    )
                )
                ):(
                React.createElement("div", null)
                )
            )
        )
    }
});

ReactDOM.render(
    React.createElement(PostsList, null),
    document.getElementById('search_panel')
);

ReactDOM.render(
    React.createElement(PostsEditor, null),
    document.getElementById('content_panel')
);

},{}]},{},[1]);
