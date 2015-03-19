var child_process = require('child_process');
var fs = require('fs');

function runTestFile(done) {
// Run the command in a subshell
child_process.exec('mocha test.js', function(error, stdout, stderr){
    done({
      exit: error ? 'failed' : 'passed',
      out: stdout + stderr
    });
  });
}

exports.runTestFile = runTestFile;
