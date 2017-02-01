const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const querystring = require('querystring');
const request = require('request');
require('dotenv').config();

let app = express();

app.set('port', (process.env.PORT || 4200));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, 'dist')));


app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
  authorizeTwitter(process.env.twitterAPIKey, process.env.twitterAPISecret);
});

function authorizeTwitter(appKey, appSecret) {
  let credentials = `${querystring.escape(appKey)}:${querystring.escape(appSecret)}`;
  let buf = new Buffer(credentials);
  let encodedCredentials = buf.toString('base64');

  let options = {
    headers: {
      'Authorization': `Basic ${encodedCredentials}`,
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
    },
    body: 'grant_type=client_credentials'
  };

  request.post('https://api.twitter.com/oauth2/token', options, function(error, response, body) {
    if (!error && response.statusCode == 200){
      process.env.twitterAPIToken = body.access_token;
    }
  });
}

function isTwitterAuthorized() {
  return process.env.twitterAPIToken !== null && process.env.twitterAPIToken !== undefined;
}
