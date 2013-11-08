var liveBookshelf = require('./base.js');
var uuid = require('node-uuid');
var Legislator = require('./legislator.js')

// Create user model
var User = liveBookshelf.Model.extend({
  tableName: 'users',

  permittedAttributes: [
        'id', 'uuid', 'name', 'password', 'email', 'location',
        'accessibility', 'status', 'language', 'meta_title', 'meta_description', 'last_login', 'created_at',
        'created_by', 'updated_at', 'updated_by'
    ],

  //Permitted Attributes?

  creating: function() {
    var self = this;

    liveBookshelf.Model.prototype.creating.call(this);

    //slug generation?
  },


  legislator: function() {
    return this.belongsToMany(Legislator);
  }

});

var Users = liveBookshelf.Collection.extend({

  model: User
});

module.exports = {
  User: User,
  Users: Users
};