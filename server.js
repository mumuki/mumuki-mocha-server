var express = require('express');
var Response = require('express-response');
var app = express();
var fs = require('fs');
var compiler = require('./file-test-compiler');
var runner = require('./command-line-test-runner');
var bodyParser = require('body-parser');
app.use(bodyParser.json(),bodyParser.urlencoded({ extended: true }));

app.post('/test', function (req, res) {
  var path = compiler.createCompilationFile(req.body);
  console.log(req.body);
  var output = runner.runTestFile(path);
  Response.OK(res)({"exit":"passed","out":output});
})

var server = app.listen(8080, function () {

})