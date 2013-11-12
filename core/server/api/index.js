// # Ghost Data API
// Provides access to the data model

var _            = require('underscore'),
    when         = require('when'),
    errors       = require('../errorHandling'),
    permissions  = require('../permissions'),
    db           = require('./db'),
    canThis      = permissions.canThis,

    dataProvider = require('../../models'),
    posts,
    users,
    tags,
    requestHandler,
    settingsObject,
    settingsCollection,
    settingsFilter,
    filteredUserAttributes = ['password', 'created_by', 'updated_by', 'last_login'];

// ## Posts
posts = {
    // #### Browse

    // **takes:** filter / pagination parameters
    browse: function browse(options) {

        // **returns:** a promise for a page of posts in a json object
        //return dataProvider.Post.findPage(options);
        return dataProvider.Post.findPage(options).then(function (result) {
            var i = 0,
                omitted = result;

            for (i = 0; i < omitted.posts.length; i = i + 1) {
                omitted.posts[i].author = _.omit(omitted.posts[i].author, filteredUserAttributes);
                omitted.posts[i].user = _.omit(omitted.posts[i].user, filteredUserAttributes);
            }
            return omitted;
        });
    },

    // #### Read

    // **takes:** an identifier (id or slug?)
    read: function read(args) {
        // **returns:** a promise for a single post in a json object

        return dataProvider.Post.findOne(args).then(function (result) {
            var omitted;

            if (result) {
                omitted = result.toJSON();
                omitted.author = _.omit(omitted.author, filteredUserAttributes);
                omitted.user = _.omit(omitted.user, filteredUserAttributes);
                return omitted;
            }
            return when.reject({errorCode: 404, message: 'Post not found'});

        });
    },

    // #### Edit

    // **takes:** a json object with all the properties which should be updated
    edit: function edit(postData) {
        // **returns:** a promise for the resulting post in a json object
        if (!this.user) {
            return when.reject({errorCode: 403, message: 'You do not have permission to edit this post.'});
        }
        var self = this;
        return canThis(self.user).edit.post(postData.id).then(function () {
            return dataProvider.Post.edit(postData).then(function (result) {
                if (result) {
                    var omitted = result.toJSON();
                    omitted.author = _.omit(omitted.author, filteredUserAttributes);
                    omitted.user = _.omit(omitted.user, filteredUserAttributes);
                    return omitted;
                }
                return when.reject({errorCode: 404, message: 'Post not found'});
            }).otherwise(function (error) {
                return dataProvider.Post.findOne({id: postData.id, status: 'all'}).then(function (result) {
                    if (!result) {
                        return when.reject({errorCode: 404, message: 'Post not found'});
                    }
                    return when.reject({message: error.message});
                });
            });
        }, function () {
            return when.reject({errorCode: 403, message: 'You do not have permission to edit this post.'});
        });
    },

    // #### Add

    // **takes:** a json object representing a post,
    add: function add(postData) {
      console.log("postData: ", postData);
      console.log("user: ", this.user);
      console.log("user.session", this.user.session);
        // **returns:** a promise for the resulting post in a json object
        if (!this.user) {
            return when.reject({errorCode: 403, message: 'You do not have permission to add posts.'});
        }

        return canThis(this.user).create.post().then(function () {
            return dataProvider.Post.add(postData);
        }, function () {
            return when.reject({errorCode: 403, message: 'You do not have permission to add posts.'});
        });
    },

    // #### Destroy

    // **takes:** an identifier (id or slug?)
    destroy: function destroy(args) {
        // **returns:** a promise for a json response with the id of the deleted post
        if (!this.user) {
            return when.reject({errorCode: 403, message: 'You do not have permission to remove posts.'});
        }

        return canThis(this.user).remove.post(args.id).then(function () {
            return when(posts.read({id : args.id, status: 'all'})).then(function (result) {
                return dataProvider.Post.destroy(args.id).then(function () {
                    var deletedObj = {};
                    deletedObj.id = result.id;
                    deletedObj.slug = result.slug;
                    return deletedObj;
                });
            });
        }, function () {
            return when.reject({errorCode: 403, message: 'You do not have permission to remove posts.'});
        });
    }
};

// ## Users
users = {
    // #### Browse

    // **takes:** options object
    browse: function browse(options) {
        // **returns:** a promise for a collection of users in a json object

        return dataProvider.User.browse(options).then(function (result) {
            var i = 0,
                omitted = {};

            if (result) {
                omitted = result.toJSON();
            }

            for (i = 0; i < omitted.length; i = i + 1) {
                omitted[i] = _.omit(omitted[i], filteredUserAttributes);
            }

            return omitted;
        });
    },

    // #### Read

    // **takes:** an identifier (id or slug?)
    read: function read(args) {
        // **returns:** a promise for a single user in a json object
        if (args.id === 'me') {
            args = {id: this.user};
        }

        return dataProvider.User.read(args).then(function (result) {
            if (result) {
                var omitted = _.omit(result.toJSON(), filteredUserAttributes);
                return omitted;
            }

            return when.reject({errorCode: 404, message: 'User not found'});
        });
    },

    // #### Edit

    // **takes:** a json object representing a user
    edit: function edit(userData) {
        // **returns:** a promise for the resulting user in a json object
        userData.id = this.user;
        return dataProvider.User.edit(userData).then(function (result) {
            if (result) {
                var omitted = _.omit(result.toJSON(), filteredUserAttributes);
                return omitted;
            }
            return when.reject({errorCode: 404, message: 'User not found'});
        });
    },

    // #### Add

    // **takes:** a json object representing a user
    add: function add(userData) {

        // **returns:** a promise for the resulting user in a json object
        return dataProvider.User.add(userData);
    },

    // #### Check
    // Checks a password matches the given email address

    // **takes:** a json object representing a user
    check: function check(userData) {
        // **returns:** on success, returns a promise for the resulting user in a json object
        return dataProvider.User.check(userData);
    },

    // #### Change Password

    // **takes:** a json object representing a user
    changePassword: function changePassword(userData) {
        // **returns:** on success, returns a promise for the resulting user in a json object
        return dataProvider.User.changePassword(userData);
    },

    forgottenPassword: function forgottenPassword(email) {
        return dataProvider.User.forgottenPassword(email);
    }
};

tags = {
    // #### All

    // **takes:** Nothing yet
    all: function browse() {
        // **returns:** a promise for all tags which have previously been used in a json object
        return dataProvider.Tag.findAll();
    }
};

// ## Request Handlers

function invalidateCache(req, res, result) {
    var parsedUrl = req._parsedUrl.pathname.replace(/\/$/, '').split('/'),
        method = req.method,
        endpoint = parsedUrl[4],
        id = parsedUrl[5],
        cacheInvalidate,
        jsonResult = result.toJSON ? result.toJSON() : result;

    if (method === 'POST' || method === 'PUT' || method === 'DELETE') {
        if (endpoint === 'settings' || endpoint === 'users') {
            cacheInvalidate = "/*";
        } else if (endpoint === 'posts') {
            cacheInvalidate = "/, /page/*, /rss/, /rss/*";
            if (id && jsonResult.slug) {
                cacheInvalidate += ', /' + jsonResult.slug + '/';
            }
        }
        if (cacheInvalidate) {
            res.set({
                "X-Cache-Invalidate": cacheInvalidate
            });
        }
    }
}

// ### requestHandler
// decorator for api functions which are called via an HTTP request
// takes the API method and wraps it so that it gets data from the request and returns a sensible JSON response
requestHandler = function (apiMethod) {
    return function (req, res) {
        var options = _.extend(req.body, req.query, req.params),
            apiContext = {
                user: req.session && req.session.user
            };

        return apiMethod.call(apiContext, options).then(function (result) {
            invalidateCache(req, res, result);
            res.json(result || {});
        }, function (error) {
            var errorCode = error.errorCode || 500,
                errorMsg = {error: _.isString(error) ? error : (_.isObject(error) ? error.message : 'Unknown API Error')};
            res.json(errorCode, errorMsg);
        });
    };
};

// Public API
module.exports.posts = posts;
module.exports.users = users;
module.exports.tags = tags;
module.exports.notifications = notifications;
module.exports.settings = settings;
module.exports.db = db;
module.exports.requestHandler = requestHandler;
