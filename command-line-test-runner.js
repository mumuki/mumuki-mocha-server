function runTestFile(path) {
  var exec = require('child_process').exec;
  exec('pwd', function (error, stdout, stderr) {
    console.log(stdout);
  });
}

exports.runTestFile = runTestFile;
