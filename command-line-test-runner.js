var fs = require('fs');
function runTestFile(path) {
  var response;
  var exec = require('child_process').exec;
  var options = {cwd: true}
  exec('mocha test.js', options, function (error, stdout, stderr) {
    console.log("Stdout: "+stdout);
    console.log("Error: "+error);
    console.log("Stderr: "+stderr);
    response = stdout;
    fs.unlink('./test.js',function(err) {
    });
  });
  return response;
}

exports.runTestFile = runTestFile;
