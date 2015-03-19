var child_process = require('child_process');
var fs = require('fs');

function runTestFile(done) {
// Run the command in a subshell
child_process.exec(
  'mocha -R reporter-file test.js 2>&1 1>output && echo done! > done', function(){
    // Read the output
    var output = fs.readFileSync('output');
    console.log(String(output));
    // Delete temporary files.
    done(output);
  });
}

exports.runTestFile = runTestFile;
