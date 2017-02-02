const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const querystring = require('querystring');
const request = require('request');
const async = require('async');
require('dotenv').config();

let app = express();

app.set('port', (process.env.PORT || 4200));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, 'dist')));

app.get('/tweets', (req, res) => {
  //TODO: add a query parameter to determine which accounts to fetch
  let accounts = ["realdonaldtrump", "potus", "vp", "presssec", "whitehouse"];
  if (req.query.exclude) {
    let excludedAccounts = req.query.exclude.split(",").map(account => account.toLowerCase());
    accounts = accounts.filter((a) => !excludedAccounts.includes(a));
  }
  let requests = accounts.map((accountName) => {
    return (callback) => {
      request.get(`https://api.twitter.com/1.1/statuses/user_timeline.json?screen_name=${accountName}`,
        { 'auth': { 'bearer': app.get('twitterAPIToken') }},(error, response, body) => {
        callback(error, body);
      });
    };
  });

  async.parallel(requests, (error, responses) => {
    let mergedResponse = responses.reduce((accumulator, current) => {
      return accumulator.concat(current);
    }, []);

    res.json(mergedResponse);
  });
});

app.listen(app.get('port'), () => {
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

  request.post('https://api.twitter.com/oauth2/token', options, (error, response, body) => {
    if (!error && response.statusCode == 200){
      let parsedBody = JSON.parse(body);
      app.set('twitterAPIToken', parsedBody.access_token);
    }
  });
}

function isTwitterAuthorized() {
  return app.get('twitterAPIToken') !== null || app.get('twitterAPIToken') !== undefined;
}
