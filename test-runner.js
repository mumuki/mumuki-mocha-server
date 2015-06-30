'use strict';

var child_process = require('child_process');
var fs = require('fs');

function runTestFile(file, done) {
  child_process.exec('mocha -C ' + file, function (error, stdout, stderr) {
    done({
      exit: error ? 'failed' : 'passed',
      out: stdout + stderr
    });
  });
}

exports.runTestFile = runTestFile;
