function runTestFile(path) {
  var response;
  var exec = require('child_process').exec;
  exec('mocha '+path, function (error, stdout, stderr) {
    /*console.log("Error: "+error);
    console.log("Stdout: "+stdout);
    console.log("Stderr: "+stderr);*/
    response = stdout;
  });
  return response;
}

exports.runTestFile = runTestFile;
