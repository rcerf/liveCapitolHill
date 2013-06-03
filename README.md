

# Instagram Gallery: Storify API example written in Node.js

sfy-gallery

Storify runs on Node.js, therefore why not use it to write an application that demonstrates how to use Storify API? The app will fetch story object and display title, description, and a gallery of the elements/images like this:

![Instagram Gallery: Storify API + Node.js = <3 ](http://f.cl.ly/items/373q1v3u3Y3d3P1w1e0t/Screen%20Shot%202013-06-03%20at%2010.23.48%20AM.png)

## A File Structure 

- index.js
- package.json
- public/js/main.js
- public/index.html
- css/bootstrap-responsive.min.css
- css/flatly-bootstrap.min.css

## Dependencies

* express: 3.2.5
* superagent: 0.14.6
* consolidate: 0.9.1
* handlebars: 1.0.12

package.json:

```json
{
  "name": "sfy-demo",
  "version": "0.0.0",
  "description": "Simple Node.js demo app on top of Storify API",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "dependencies": {
    "express": "3.2.5",
    "superagent": "0.14.6",
    "consolidate": "0.9.1",
    "handlebars": "1.0.12"
  },
  "repository": "",
  "author": "Azat Mardanov",
  "license": "BSD"
}

```
## Node.js Server

```javascript
var express = require('express');
var superagent = require('superagent');
var consolidate = require('consolidate');


var app = express();

//Configure tempate engine
app.engine('html', consolidate.handlebars);
app.set('view engine', 'html');
app.set('views', __dirname + '/views');

//Set up static folder
app.use(express.static(__dirname + '/public'));

var user = 'azat_co';
var story_slug = 'kazan';

//Paste your values
var api_key = "";
var username = "";
var _token = "";

app.get('/',function(req, res){
  //Fetch elements from Storify API
  superagent.get("http://api.storify.com/v1/stories/" + user + "/" + story_slug)
    .query({api_key: api_key,
      username: username,
      _token: _token})
    .set({  Accept: 'application/json' })
    .end(function(e, storifyResponse){
      if (e) next(e);
      //Render template with story object in response body     
      return res.render('index',storifyResponse.body.content);      
    })

})

app.listen(3001);
```

## Handlebars Template

```html
<!DOCTYPE html lang="en">
<html>
  <head>
    <link type="text/css" href="css/flatly-bootstrap.min.css" rel="stylesheet" />
    <link type="text/css" href="css/bootstrap-responsive.min.css" rel="stylesheet"/>
  </head>

  <body class="container">
    <div class="row">
      <h1>{{title}}<small> by {{author.name}}</small></h1>
      <p>{{description}}</p>
    </div>
    <div class="row">
      <ul class="thumbnails">
      {{#each elements}}
        <li class="span3"><a class="thumbnail" href="{{permalink}}" target="_blank"><img src="{{data.image.src}}" title="{{data.image.caption}}" /></a></li>
      {{/each}}
      </ul>
    </div>
  </body>

</html>
```
## Conclusion

Storify API allows developers to retrieve and manipulate stories and elements within the stories. The full description is available at [dev.storify.com](http://dev.storify.com).
