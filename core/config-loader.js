var fs = require('fs');
var url = require('url');
var when = require('when');
var path = require('path');

var appRoot = path.resolve(__dirname, '../');
var config = path.join(appRoot, 'config.js');

var validateConfigEnvironment = function() {
  var envVal = process.env.NODE_ENV || 'undefined';
  var config;

  try {
    config = require('../config')[envVal]
  } catch (ignore) {

  }

  var hasHostAndPort = config.server && !!config.server.host && !!config.server.port;
  var hasSocket = config.server && !!config.server.socket;

  return when.resolve();
}

var loadConfig = function() {
  var loaded = when.defer();
  // Check for config file and then start the server.
  fs.exists(config, function checkConfig(configExists) {
    if(configExists) {
      validateConfigEnvironment().then(loaded.resolve).otherwise(loaded.reject);
    } else {
      console.log("error loading the config file");
    }
  });
  return loaded.promise;
}

module.exports = loadConfig;