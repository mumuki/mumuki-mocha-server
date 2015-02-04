var fs = require('fs');
var tmp = require('tmp');

function createCompilationFile(body) {
  var require = "var assert = require('assert');";
  fs.appendFile('test.js', require+'\n'+'\n'+body.test, function (err) {
    });
}
exports.createCompilationFile = createCompilationFile;
