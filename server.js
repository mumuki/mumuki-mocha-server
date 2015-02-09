var express = require('express');
var Response = require('express-response');
var app = express();
var fs = require('fs');
var compiler = require('./file-test-compiler');
var runner = require('./command-line-test-runner');
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false })
var parseString = require('xml2js').parseString;

app.post('/test', urlencodedParser, function (req, res) {
  /*var json = {};
  for(var id in req.body) {
    json = JSON.parse(id);
  }*/
  compiler.createCompilationFile(req.body);
  var result = "";
  var output = runner.runTestFile();
  parseString(output[1], {async: false}, function (err, result) {
    if(result.testsuite.$.failures === "0")
      result = "passed";
    else
      result = "failed";
  });
  while (result === "") {}
  console.log(result);
  Response.OK(res)({"exit":result,"out":String(output[0])});
  fs.unlinkSync("test.js");
  fs.unlinkSync("xunit.xml");
})

var server = app.listen(8080, function () {

})