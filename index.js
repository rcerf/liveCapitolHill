var express = require('express');
var superagent = require('superagent');
var consolidate = require('consolidate');
var path = require('path');
var config = require(path.join(__dirname, '/config.js'));
var mysql = require('mysql');
var Bookshelf = require('bookshelf');


if(config == undefined || config.apikey == undefined || config.apikey == ""){
  throw Error("MUST CREATE YOUR OWN CONFIG FILE, LOOK AT CONFIG.TMP FOR AN EXAMPLE");
}



//initialize mysql database using bookshelf
Bookshelf.mysql = Bookshelf.initialize({
  client: 'mysql',
  connection: {
    host: '127.0.0.1',
    user: livecapitolhill,
    password: 'legislature',
    database: 'livecapitolhill',
    charset: 'utf8'

  }
});

// define the data structure by giving property names and datatypes
var User = Bookshelf.mysql.Model.extend({
  tableName: 'users',

  initialize: function(){

  },

});

var Legislator = Bookshelf.Model.extend({
  bills: function() {
    return this.belongsToMany(Bill).through(Vote);
  }
});

var Vote = Bookshelf.Model.extend({
  bill: function() {
    return this.belongsTo(Bill);
  },
  legislator: function() {
    return this.belongsTo(Legislator);
  }
});

var Bill = Bookshelf.Model.extend({
  legislator: function() {
    return this.belongsToMany(Legislator).through(Vote);
  }
});

//initialize server using express
var app = express();

//Configure template engine
app.engine('html', consolidate.handlebars);
app.set('view engine', 'html');
app.set('views', __dirname + '/views');

//Set up static folder
app.use(express.static(__dirname + '/public'));


//define inputs for API call
var legislator = 'A000014';
var method = 'votes/';
var field1 = 'voter_ids.';
var bill = 'hr384-111';
var field2 = 'bill_id.';

var api_key = config.apikey;

//routes
app.get('/',function(req, res){
  superagent.get("http://congress.api.sunlightfoundation.com/votes?bill_id=" + bill +"&fields=voter_ids,voted_at")
    .set('X-APIKey', api_key)
    .set({  Accept: 'application/json' })
    .end(function(e, sunlightResponse){
      console.log(sunlightResponse.headers);
      if (e){
        console.log('e');
        next(e);
      } 
      //Render template 
      console.log(sunlightResponse.body);
      return res.render('index', sunlightResponse.body);      
    })
});

//initiate connection
app.listen(3001);