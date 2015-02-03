function runTestFile(path) {
  var response;
  console.log(path);
  var exec = require('child_process').exec;
  exec('cd /tmp;mocha', function (error, stdout, stderr) {
    console.log("Stdout: "+stdout);
    console.log("Error: "+error);
    console.log("Stderr: "+stderr);
    response = stdout;
  });
  return response;
}

exports.runTestFile = runTestFile;
