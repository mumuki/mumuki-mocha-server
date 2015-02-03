var express = require('express');
var Response = require('express-response');
var app = express();
var fs = require('fs');
var compiler = require('./file-test-compiler');
var runner = require('./command-line-test-runner');
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false })

app.post('/test', urlencodedParser, function (req, res) {
  var json = {};
  for(var id in req.body) {
    json = JSON.parse(id);
  }
  var path = compiler.createCompilationFile(json);
  var output = runner.runTestFile(path);
  Response.OK(res)({"exit":"passed","out":output});
})

var server = app.listen(8080, function () {

})