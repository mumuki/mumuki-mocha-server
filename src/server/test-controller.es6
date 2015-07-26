'use strict';

let Bluebird = require('bluebird');

let compiler = require('./test-compiler');
let runner = require('./test-runner');
let del = require('del');

let delAsync = Bluebird.promisify(del);

module.exports = {

  handle: function (req, res) {
    return Bluebird.resolve(req.body)
      .then(compiler.createCompilationFile)
      .then(runner.runTestFile)
      .tap((testReport) => res.status(200).json(testReport.result))
      .tap((testReport) => delAsync(testReport.filepath, { force: true }));
  }

};
