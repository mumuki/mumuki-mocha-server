var fs = require('fs');
var tmp = require('tmp');


function createCompilationFile(body) {
  var require = "var assert = require('assert');";
  fs.writeFileSync('test.js', require+'\n'+body.content+'\n'+body.test);
}
exports.createCompilationFile = createCompilationFile;
