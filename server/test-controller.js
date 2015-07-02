'use strict';

var Bluebird = require('bluebird');

var compiler = require('./test-compiler');
var runner = require('./test-runner');

module.exports = {

  handle: function (req, res) {
    return Bluebird.resolve(req.body)
      .then(compiler.createCompilationFile)
      .then(runner.runTestFile)
      .then(res.status(200).json.bind(res));
  }

};

