var superagent = require('superagent');

module.exports.fetchActiveBills = function(params, cb) {
  // http://congress.api.sunlightfoundation.com/bills?fields=chamber,titles.title,sponsor_id,history.active_at,last_version,votes&history.active=true
  superagent.get("http://congress.api.sunlightfoundation.com/bills?fields=chamber,titles.title,sponsor_id,history.active_at,last_version,votes&history.active=true")
    .set('X-APIKey', params.api_key)
    .set({  Accept: 'application/json' })
    .end(function(e, sunlightResponse){
      console.log(sunlightResponse.headers);
      if (e){
        console.log('e');
        next(e);
      } 
      console.log(sunlightResponse.body);
      cb(sunlightResponse.body);      
    });
}

module.exports.fetchLegislatorBills = function(params, cb) {
  superagent.get("http://congress.api.sunlightfoundation.com/" + params.method +"/?" + params.field + params.legislator + "__exists=true")
    .set('X-APIKey', params.api_key)
    .set({  Accept: 'application/json' })
    .end(function(e, sunlightResponse){
      // console.log(sunlightResponse.headers);
      if (e){
        console.log('e');
        next(e);
      } 
      //Render template with story object in response body
      // console.log(sunlightResponse.body);
      cb(sunlightResponse.body);      
    });
}

module.exports.fetchLegislators = function(params, cb) {
  superagent.get("http://congress.api.sunlightfoundation.com/legislators" + params.method + params.zip +"&per_page=all")
    .set('X-APIKey', params.api_key)
    .set({  Accept: 'application/json' })
    .end(function(e, sunlightResponse){
      // console.log(sunlightResponse.headers);
      if (e){
        console.log('e');
        next(e);
      } 
      //Render template with story object in response body
      // console.log(sunlightResponse.body);
      cb(sunlightResponse.body);      
    });
}