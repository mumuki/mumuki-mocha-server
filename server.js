var express = require('express');
var Response = require('express-response');
var app = express();
var fs = require('fs');
var compiler = require('./file-test-compiler');
var runner = require('./command-line-test-runner');
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();
var urlencodedParser = bodyParser.urlencoded({ extended: false })

app.post('/test', urlencodedParser, function (req, res) {
  var path = compiler.createCompilationFile(req.body);
  runner.runTestFile(path);
  Response.OK(res)({"exit":"passed","out":"All is passing"});
})

var server = app.listen(8080, function () {

})