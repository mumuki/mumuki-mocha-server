var express = require('express');
var Response = require('express-response');

var app = express();
var fs = require('fs');

var compiler = require('./test-compiler');
var runner = require('./test-runner');

var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false })
var parseString = require('xml2js').parseString;
var childProcess = require('child_process');

app.post('/test', urlencodedParser, function (req, res) {
  compiler.createCompilationFile(req.body);
  var result2 = "";
  var output2 = "";

  runner.runTestFile(function(result){
    Response.OK(res)(result);
    fs.unlinkSync("test.js");
  });
})

var server = app.listen(8080, function () {
  console.log("Serving on port 8080");
})
