var liveBookshelf = require('.?/base');

//Create Nomination model
var Nomination = liveBookshelf.Model.extend({
  hasTimestamps: true,

  tableName: 'nominations',
  legislator: function() {
    return this.belongsToMany(Legislator).through(Vote);
  }
});
//Create Nominatations collection
var Nominations = liveBookshelf.Collection.extend({
  model: Nomination
});

module.exports = {
  Nomination: Nomination,
  Nominations: Nominations
};