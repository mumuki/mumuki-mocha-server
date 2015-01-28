var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();
var urlencodedParser = bodyParser.urlencoded({ extended: false })

app.post('/test', urlencodedParser, function (req, res) {
  console.log(req.body);
})

var server = app.listen(8080, function () {

})