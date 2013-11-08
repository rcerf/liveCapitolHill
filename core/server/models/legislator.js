var liveBookshelf = require('./base');

//Create legislator model
var Legislator = liveBookshelf.Model.extend({
  tableName: 'legislators',
  bills: function() {
    return this.belongsToMany(Bill).through(Vote);
  },
  nomination: function() {
    return this.belongsToMany(Nomination).through(Vote);
  }
});

 //Create Legislator collection
var Legislators = liveBookshelf.Collection.extend({
  model: Legislator
});

module.exports = {
  Legislator: Legislator,
  Legislators: Legislators
},