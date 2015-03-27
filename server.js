var express = require('express');
var bodyParser = require('body-parser')

var app = express();

var jsonParser = bodyParser.json({ type: 'application/*' });

var compiler = require('./test-compiler');
var runner = require('./test-runner');

app.post('/test', jsonParser, function (req, res) {
  compiler.createCompilationFile(req.body, function(file){
    runner.runTestFile(file, function(result) {
      res.send(JSON.stringify(result));
    });
  });
})

var port = process.env.PORT || 8080;
var server = app.listen(port, function () {
  console.log("Serving on port " + port);
})
