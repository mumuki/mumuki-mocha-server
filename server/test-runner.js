'use strict';

var child_process = require('child_process');

var Bluebird = require('bluebird');

function runTestFile(filepath) {
  return new Bluebird(function (resolve, reject) {
    child_process.exec('mocha -C ' + filepath, function (error, stdout, stderr) {
      resolve({
        exit: error ? 'failed' : 'passed',
        out: stdout + stderr
      });
    });
  });
}

exports.runTestFile = runTestFile;
