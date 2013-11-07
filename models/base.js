var liveBookshelf = require('./../server.js');
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

module.exports = liveBookshelf;