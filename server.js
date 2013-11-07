var express = require('express');
var superagent = require('superagent');
var consolidate = require('consolidate');
var path = require('path');
var config = require(path.join(__dirname, '/config.js'));
var mysql = require('mysql');
var Bookshelf = require('bookshelf');
var Models = require('./models/base.js');


// Create user model
var User = Bookshelf.mysql.Model.extend({
  tableName: 'users',

  legislator: function() {
    return this.belongsToMany(Legislator);
  }

});

//initialize server using express
var server = express();

//Configure template engine
server.engine('html', consolidate.handlebars);
server.set('view engine', 'html');
server.set('views', __dirname + '/views');

//Set up static folder
server.use(express.static(__dirname + '/public'));


//define inputs for API call
var legislator = 'A000014';
var method = 'votes/';
var field1 = 'voter_ids.';
var bill = 'hr384-111';
var field2 = 'bill_id.';

var api_key = config.apikey;

//routes
server.get('/',function(req, res){
  superagent.get("http://congress.api.sunlightfoundation.com/votes?bill_id=" + bill +"&fields=voter_ids,voted_at")
    .set('X-APIKey', api_key)
    .set({  Accept: 'serverlication/json' })
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
server.listen(3001);