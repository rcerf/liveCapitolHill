var path = require('path');

var config = {
  apikey: "220eaa555c0d4fc6ab4a1882269afa26",

  development: {
    
    //No URL...

    database: {
      client: 'mysql',
      connection: {
        host: '127.0.0.1',
        user: root,
        password: 'Stanford',
        database: 'livecapitolhill',
        charset: 'utf8'
        },
        degug: false
    },
    server: {
      host: '127.0.0.1',
      port: '2360'
    }
  }

  //Production config?
}

module.exports = config;