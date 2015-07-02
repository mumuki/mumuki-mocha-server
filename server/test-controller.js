'use strict';

var Bluebird = require('bluebird');

var compiler = require('./test-compiler');
var runner = require('./test-runner');
var del = require('del');

var delAsync = Bluebird.promisify(del);

var sendResult = function (testReport) {
  this.status(200).json(testReport.result);
};

var deleteTempFile = function (testReport) {
  return delAsync(testReport.filepath);
};

module.exports = {

  handle: function (req, res) {
    return Bluebird.resolve(req.body)
      .then(compiler.createCompilationFile)
      .then(runner.runTestFile)
      .tap(sendResult.bind(res))
      .tap(deleteTempFile);
  }

};
