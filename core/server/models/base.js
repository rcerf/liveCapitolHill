var Bookshelf = require('bookshelf');
var uuid      = require('node-uuid');
var config    = require('../../../config.js');
var moment    = require('moment');
var when      = require('when');
var _         = require('underscore');
var sanitize  = require('validator').sanitize;

//might need to require index.js and mysql? 

//initialize mysql database using bookshelf
//defaults to development environment
var liveBookshelf = Bookshelf.live = Bookshelf.initialize(config[process.env.NODE_ENV || 'development'].database);
var liveBookshelf.client = config[process.env.NODE_ENV].database.client;

liveBookshelf.validator = new Validator();

liveBookshelf.Model = liveBookshelf.Model.extend({

  hasTimestamps: true,

  defaults: function() {
    return {
      uuid: uuid.v4() //asigns a GUID to each row over every table
    };
  }

  intialize: function() {
    this.on('saving', this.saving, this);
  },

  saving: function() {
    // Remove any properties which don't belong on the post model
    this.attributes = this.pick(this.permittedAttributes);
    this.set('updated_by', 1);
  },

// Base prototype properties will go here
// Fix problems with dates
  fixDates: function (attrs) {
    _.each(attrs, function (value, key) {
      if (key.substr(-3) === '_at' && value !== null) {
        attrs[key] = moment(attrs[key]).toDate();
      }
    });

  return attrs;
},

format: function (attrs) {
  return this.fixDates(attrs);
},

toJSON: function (options) {
  var attrs = this.fixDates(_.extend({}, this.attributes));
  var relations = this.relations;

  if (options && options.shallow) {
    return attrs;
  }

  _.each(relations, function (relation, key) {
    if (key.substring(0, 7) !== '_pivot_') {
      attrs[key] = relation.toJSON ? relation.toJSON() : relation;
    }
  });

  return attrs;
}
 //no generateSlug

}, {
 
  //Naive find all - @param options are optional
  findAll: function(options) {
  options = options || {};
  return liveBookshelf.Collection.forge([], {model: this}).fetch(options);
  },

  browse: function() {
  return this.findAll.apply(this, arguments);
  },

  /*
  * Naive find one whee args match
  * @param args
  * @param options are optoinal
  */
  findOne: function(args, options) {
  options = options || {};
  return this.forge(args).fetch(options);
  },

  read: function() {
  return this.edit.apply(this, arguments);
  },

   /**
   * Naive edit
   * @param editedObj
   * @param options (optional)
   */
  edit: function (editedObj, options) {
      options = options || {};
      return this.forge({id: editedObj.id}).fetch(options).then(function (foundObj) {
          return foundObj.save(editedObj);
      });
  },

  update: function () {
      return this.edit.apply(this, arguments);
  },

  /**
   * Naive create
   * @param newObj
   * @param options (optional)
   */
  add: function (newObj, options) {
      options = options || {};
      return this.forge(newObj).save(options);
  },

  create: function () {
      return this.add.apply(this, arguments);
  },

  /**
   * Naive destroy
   * @param _identifier
   * @param options (optional)
   */
  destroy: function (_identifier, options) {
      options = options || {};
      return this.forge({id: _identifier}).destroy(options);
  },

  'delete': function () {
      return this.destroy.apply(this, arguments);
  }

});

module.exports = liveBookshelf;