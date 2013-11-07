var liveBookshelf = require('./base.js');

//Create Bill model
var Bill = liveBookshelf.Model.extend({
  hasTimestamps: true,

  tableName: 'bills',
  legislator: function() {
    return this.belongsToMany(Legislator).through(Vote);
  }
});

//Create Bills collection
var Bills = liveBookshelf.Collection.extend({
  model: Bill
});

module.exports = {
  Bill: Bill,
  Bills: Bills
};