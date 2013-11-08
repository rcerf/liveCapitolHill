var liveBookshelf = require('./base.js');


//Create Vote model
var Vote = liveBookshelf.Model.extend({
  hasTimestamps: true,

  tableName: 'votes',
  bill: function() {
    return this.belongsTo(Bill);
  },
  nomination: function() {
    return this.belongsTo(Nomination);
  },
  legislator: function() {
    return this.belongsTo(Legislator);
  }
});
//Create Votes collection
var Votes = liveBookshelf.Collection.extend({
  model: Vote
});

module.exports = {
  Vote: Vote,
  Votes: Votes
};