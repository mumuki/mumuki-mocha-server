var child_process = require('child_process');
var fs = require('fs');
 
function runTestFile() {
// Run the command in a subshell
child_process.exec("mocha -R reporter-file test.js" + ' 2>&1 1>output && echo done! > done');
 
// Block the event loop until the command has executed.
while (!fs.existsSync('output') && !fs.existsSync('xunit.xml')) {
// Do nothing
}
 
// Read the output
var output = fs.readFileSync('output');
console.log(String(output));
 
// Delete temporary files.


 
return output;
}

exports.runTestFile = runTestFile;
