var superagent = require('superagent');

module.exports.fetchLegislator = function(params, cb) {
  superagent.get("http://congress.api.sunlightfoundation.com/" + params.method +"?" + params.field + params.legislator + "__exists=true")
    .set('X-APIKey', params.api_key)
    .set({  Accept: 'application/json' })
    .end(function(e, sunlightResponse){
      console.log(sunlightResponse.headers);
      if (e){
        console.log('e');
        next(e);
      } 
      //Render template with story object in response body
      console.log(sunlightResponse.body);
      cb(sunlightResponse.body);      
    });
}