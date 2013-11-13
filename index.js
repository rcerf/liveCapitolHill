var express = require('express');
var superagent = require('superagent');
var consolidate = require('consolidate');
var apikey = require(__dirname + "/config.js").apikey;
var sunlight = require('./sunlight.js');


var app = express();

//Configure template engine
app.engine('html', consolidate.handlebars);
app.set('view engine', 'html');
app.set('views', __dirname + '/views');

//Set up static folder
app.use(express.static(__dirname + '/public'));

var legislator = 'A000014';
var method = 'votes';
var field1 = 'voter_ids.';
var bill = 'hr384-111';
var field2 = 'bill_id.';

var params = {};

//**Routes**

//Bills legislator voted on
app.get('/bill',function(req, res){

  params = {
    field: field1,
    legislator: legislator,
    method: method,
    api_key: apikey
  };
  //Fetch elements from Sunlight API
  sunlight.fetchLegislatorBill(params, function(data){
    return res.render('legislator_bill', data);
  });
});

//Legislator Bio
app.get('/legislator',function(req, res){

  params = {
    method: '/locate?zip=',
    zip: '94118',
    api_key: apikey
  };
  //Fetch elements from Sunlight API
  sunlight.fetchLegislator(params, function(data){
    return res.render('legislator', data);
  });
});

app.listen(3001);