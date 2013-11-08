var client = require('../../models/base').client;
var knex = require('../../models/base').knex;
var _ = require('underscore');
var when = require('when');

var getTables = function(){
  return knex.raw("show tables").then(function(response) {
    return _.flatten(_.map(response[0], function(entry) {
      return _.values(entry);
    }));
  });
}

var exporter = function() {
  var tablesToExport;

  if(client === 'mysql') {
    tablesToExport = getTables();
  } else {
    return when.reject("No exporter for database client " + client);
  }

  return when.join(migration)
}
