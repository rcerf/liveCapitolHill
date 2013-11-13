var express = require('express');
var superagent = require('superagent');
var consolidate = require('consolidate');
var config = require(__dirname + "/config.js");
var sunlight = require('./sunlight.js');

if(config == undefined || config.apikey == undefined || config.apikey == ""){
  throw Error("MUST CREATE YOUR OWN CONFIG FILE, LOOK AT CONFIG.TMP FOR AN EXAMPLE");
}


var app = express();

//Configure template engine
app.engine('html', consolidate.handlebars);
app.set('view engine', 'html');
app.set('views', __dirname + '/views');

//Set up static folder
app.use(express.static(__dirname + '/public'));

var legislator = 'A000014';
var method = 'votes/';
var field1 = 'voter_ids.';
var bill = 'hr384-111';
var field2 = 'bill_id.';

//"http://congress.api.sunlightfoundation.com/" + method +"?" + field1 + legislator +"__exists=true" + "&voted_at__gte=2013-07-02T4:00:00Z"


//Paste your values
var api_key = config.apikey;

app.get('/',function(req, res){
  //Fetch elements from Sunlight API
  var params = {
    field: field1,
    legislator: legislator,
    method: method,
    api_key: config.apikey
  }

  sunlight.fetchLegislator(params, function(data){
    return res.render('legislator_bill', data);
  });

})

app.listen(3001);