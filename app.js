var express = require('express');
var superagent = require('superagent');
var consolidate = require('consolidate');
var apikey = require(__dirname + "/config.js").apikey;
var sunlight = require('./sunlight.js');
var url = require("url");
var _ = require("underscore");


var app = express();

//Configure template engine
app.engine('html', consolidate.handlebars);
app.set('view engine', 'html');
app.set('views', __dirname + '/views');

//Set up static folder
app.use(express.static(__dirname + '/public'));

var params = {};

//**Routes**
//Bills legislator voted on
app.get('/',function(req, res){
// http://congress.api.sunlightfoundation.com/bills?fields=chamber,titles.title,sponsor_id,history.active_at,last_version,votes&history.active=true
  params = {
    filter: 'history',
    method: 'bills',
    api_key: apikey
  };
  //Fetch elements from Sunlight API
  sunlight.fetchActiveBills(params, function(data){
    return res.render('index', data);
  });
});

// app.get('/activeBills',function(req, res){
// // http://congress.api.sunlightfoundation.com/bills?fields=chamber,titles.title,sponsor_id,history.active_at,last_version,votes&history.active=true
//   params = {
//     field: 'chamber,titles.title,sponsor_id,history.active_at,last_version,votes',
//     filter: 'history',
//     method: 'bills',
//     api_key: apikey
//   };
//   //Fetch elements from Sunlight API
//   sunlight.fetchActiveBills(params, function(data){
//     return res.render('activeBills', data);
//   });
// });


//Legislator Bio
app.get('/:zip',function(req, res){

  params = {
    method: '/locate?zip=',
    zip: req.params.zip,
    api_key: apikey
  };
  //Fetch elements from Sunlight API
  sunlight.fetchLegislators(params, function(data){
    data = _.extend(data, params);
    return res.render('legislator', data);
  });
});

//Bills legislator voted on
app.get('/legislator/:bioguide',function(req, res){
  console.log(req.params);

  params = {
    field: field1,
    legislator: legislator,
    method: method,
    api_key: apikey
  };
  //Fetch elements from Sunlight API
  sunlight.fetchLegislatorBills(params, function(data){
    return res.render('legislator_bill', data);
  });
});

app.listen(3001);