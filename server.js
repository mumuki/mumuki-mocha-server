var express = require('express');
var bodyParser = require('body-parser')

var app = express();

var jsonParser = bodyParser.json({ type: 'application/*' });

var Response = require('express-response');

var compiler = require('./test-compiler');
var runner = require('./test-runner');

app.post('/test', jsonParser, function (req, res) {
  compiler.createCompilationFile(req.body);
  runner.runTestFile(function(result) {
    fs.unlinkSync("test.js");
    Response.OK(res)(result);
  });
})

var server = app.listen(8080, function () {
  console.log("Serving on port 8080");
})
