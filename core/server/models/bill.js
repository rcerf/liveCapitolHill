var liveBookshelf = require('./base.js');
var _ = require('underscore');
var uuid = require('node-uuid');
var when = require('when');
var Legislator = require('./legislator').Legislator;
var Vote = require('./vote').Vote;
var Votes = require('.vote').Votes;


//Create Bill model
var Bill = liveBookshelf.Model.extend({

  tableName: 'bills',

  permittedAttributes: [
        'id', 'uuid', 'title', 'slug', 'html', 'meta_title', 'meta_description',
        'status', 'author_id', 'created_at', 'created_by', 'updated_at', 'updated_by',
        'published_at'
    ],

  defaults: function() {
    return {
      uuid: uuid.v4(),
      status: 'published'
    }
  },

  initialize: function() {
    this.on('creating', this.creating, this);
    this.on('saving', this.updateVotes, this);
    this.on('saving', this.saving, this);
  },

  saving: function() {
    var self = this;

    //Remove any 
  }


  //relations
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