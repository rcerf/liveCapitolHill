var liveBookshelf = require('./base.js');

// Create user model
var User = liveBookshelf.Model.extend({
  tableName: 'users',

  legislator: function() {
    return this.belongsToMany(Legislator);
  }

});

module.exports = {
  User: User
};