var fs = require('fs');
var tmp = require('tmp');

function createCompilationFile(body, done) {
  tmp.file(function(err, path, fd) {
    var requires = "var assert = require('assert');";
    fs.writeFile(path, requires +'\n'+ body.content + '\n' + body.test, function(){
      done(path);
    });
  });
}
exports.createCompilationFile = createCompilationFile;
