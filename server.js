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

  var output = runner.runTestFile();
  childProcess.exec("ls" + ' 2>&1 1>ls');
  var xml = fs.readFileSync('xunit.xml', 'ascii');
  parseString(xml, {async: false}, function (err, result) {
    if(result.testsuite.$.failures === "0")
      result2 = "passed";
    else
      result2 = "failed";
    if(result.testsuite.testcase[0].failure !== undefined)
      output2 = result.testsuite.testcase[0].failure[0]._;
    else
      output2 = output;
  });
  while (result2 === "") {}
  console.log(result2);
  Response.OK(res)({"exit":result2,"out":String(output2)});
  fs.unlinkSync("test.js");
  fs.unlinkSync("xunit.xml");
  fs.unlinkSync("done");
  fs.unlinkSync("output");
  fs.unlinkSync("ls");
})

var server = app.listen(8080, function () {
  console.log("Serving on port 8080");
})
