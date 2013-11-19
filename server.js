var express = require('express');
var superagent = require('superagent');
var consolidate = require('consolidate');
var apikey = require(__dirname + "/config.js").apikey;
var sunlight = require('./sunlight.js');
var url = require("url");
var _ = require("underscore");
var helpers = require('handlebars-helpers');
var Handlebars = require('handlebars');

var port = process.env.PORT || 3001;


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
    res.render('index', data);
  });
});


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
    res.render('legislator', data);
  });
});

//Bills legislator voted on
app.get('/legislator/:bioguide',function(req, res){
  console.log(req.params);

  params = {
    bioguide: req.params.bioguide,
    api_key: apikey
  };
  //Fetch elements from Sunlight API
  sunlight.fetchLegislatorVotes(params, function(data){
    res.locals = {bioguide: params.bioguide};
    res.render('legislatorPost', data);
  });
});

app.listen(port);