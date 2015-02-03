var fs = require('fs');
var tmp = require('tmp');
function createCompilationFile(body) {
  var final_path = "/tmp";
  tmp.file({postfix: '.js'}, function _tempFileCreated(err, path, fd) {
    if (err) throw err;
    fs.write(fd, "var assert = require('assert');");
    fs.write(fd, body);
    final_path = path;
    });
  return final_path;
}

exports.createCompilationFile = createCompilationFile;