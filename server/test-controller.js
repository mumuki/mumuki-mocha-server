'use strict';

var compiler = require('./test-compiler');
var runner = require('./test-runner');

module.exports = {

  handle: function (req, res) {
    compiler.createCompilationFile(req.body, function (file) {
      runner.runTestFile(file, function (result) {
        res.status(200).json(result);
      });
    });
  }

};

