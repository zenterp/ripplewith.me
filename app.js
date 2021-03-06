var express = require('express');
var ejs = require('ejs');
var app = express();
var http = require('superagent');

var RIPPLE_REST_URL = process.env.RIPPLE_REST_URL || 'https://api.ripple.com';
var PORT            = process.env.PORT            || 5000;

app.use(express.static(__dirname+'/public'));

app.set('views', __dirname + '/public');
app.set('view engine', 'ejs');

app.get('/', function(request, response) { 
  response.render('index')
});
app.get('/:name', function(request, response) { 
  response.render('index')
});
app.get('/:name/history', function(request, response) { 
  response.render('index')
});
app.get('/:name/balances', function(request, response) { 
  response.render('index')
});
app.get('/v1/accounts/:account/balances', function(request, response) {
  http.get(RIPPLE_REST_URL+'/v1/accounts/'+request.params.account+'/balances')
  .end(function(error, result) {
    response.send(result.body);
  })
});
app.get('/v1/accounts/:account/payments', function(request, response) {
  console.log('handle payments');
  http.get(RIPPLE_REST_URL+'/v1/accounts/'+request.params.account+'/payments')
  .end(function(error, result) {
    console.log(result.body);
    response.send(result.body);
  });
});

app.listen(PORT, function() {
  console.log('serving http on port', PORT);
});

