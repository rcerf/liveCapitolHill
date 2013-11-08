//liveCapitolHill bootloader

var configLoader = require('./core/config-loader.js');

// If no environment is set, default to development
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

configLoader.loadConfig().then(function() {
  require('.core/server');
}).otherwise(console.error("index.js", error););