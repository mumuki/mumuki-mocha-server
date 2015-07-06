'use strict';

var child_process = require('child_process');

var Bluebird = require('bluebird');

function runTestFile(compilation) {
  return new Bluebird(function (resolve, reject) {
    child_process.exec('mocha -C ' + compilation.filepath, function (error, stdout, stderr) {
      resolve({
        filepath: compilation.filepath,
        result: {
          exit: error ? 'failed' : 'passed',
          out: stdout + stderr,
          expectationResults: compilation.expectationResults
        }
      });
    });
  });
}

exports.runTestFile = runTestFile;
