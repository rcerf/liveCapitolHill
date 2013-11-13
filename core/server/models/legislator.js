var _ = require('underscore');
var uuid = require('node-uuid');
var when = require('when');
var nodefn = require('when/node/function');
var Bill = require('./bill').Bill;
var Vote = require('./vote').Vote;
var Nomination = require('./nomination').Nomination;

var liveBookshelf = require('./base');

//Create legislator model
var Legislator = liveBookshelf.Model.extend({

  tableName: 'legislators',

  permittedAttributes: [
    'id', 'uuid', 'name', 'password', 'image', 'cover', 'bio', 'website', 'location',
    'accessibility', 'status', 'language', 'meta_title', 'meta_description', 'last_login', 'created_at',
    'created_by', 'updated_at', 'updated_by'
    ],

  creating: function() {
    var self = this;

    liveBookshelf.Model.prototype.creating.call(this);
  },

  saving: function() {
    this.set('name', this.sanitize('name'));
    this.set('location', this.sanitize('email'));
    this.set('website', this.sanitize('website'));
    this.set('bio', this.sanitize('bio'));

    return liveBookshelf.Model.prototype.saving.apply(this, arguments);
  }

  //Relationships
  bill: function() {
    return this.belongsToMany(Bill).through(Vote);
  },
  nomination: function() {
    return this.belongsToMany(Nomination).through(Vote);
  }
}, {
  /**
     * Naive legislator add
     * @param  _legislator
     *
     * Hashes the password provided before saving to the database.
     */
  add: function(_legislator) {
    var self = this;
    var legislatorData = _.extend({}, _legislator);
    
    //creates a new model...where is it saved?
    //***maybe on the base model add.
    return self.forge();

});

 //Create Legislator collection
var Legislators = liveBookshelf.Collection.extend({
  model: Legislator
});

module.exports = {
  Legislator: Legislator,
  Legislators: Legislators
},