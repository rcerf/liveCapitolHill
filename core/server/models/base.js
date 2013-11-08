var Bookshelf = require('bookshelf');
var uuid = require('node-uuid');
//might need to require index.js and mysql? 

//initialize mysql database using bookshelf
var liveBookshelf = Bookshelf.live = Bookshelf.initialize({
  client: 'mysql',
  connection: {
    host: '127.0.0.1',
    user: root,
    password: 'Stanford',
    database: 'livecapitolhill',
    charset: 'utf8'

  }
});

console.log(liveBookshelf);

liveBookshelf.Model = liveBookshelf.Model.extend({

  hasTimestamps: true,

  defaults: function() {
    return {
      uuid: uuid.v4()
    };
  }

  intialize: function() {
    this.on('creating', this.creating, this);
    this.on('saving', this.saving, this);
  },


 //no creating b/c I don't need a created by attribute

 saving: function() {
  //might not need this attributes picker
  this.attributes = this.pick(this.permittedAttributes);
  this.set('updated_by', 1);
 },

 //no fixDates, format, or toJSON...
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