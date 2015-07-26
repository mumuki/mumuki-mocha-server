'use strict';

let Bluebird = require('bluebird');

let compiler = require('./test-compiler');
let runner = require('./test-runner');
let del = require('del');

let delAsync = Bluebird.promisify(del);

let sendResult = function (testReport) {
  this.status(200).json(testReport.result);
};

let deleteTempFile = function (testReport) {
  return delAsync(testReport.filepath, { force: true });
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
