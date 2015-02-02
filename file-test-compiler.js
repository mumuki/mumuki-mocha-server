var fs = require('fs');
var tmp = require('tmp');
function createCompilationFile(body) {
  tmp.file({postfix: '.js'}, function _tempFileCreated(err, path, fd) {
    if (err) throw err;
    fs.write(fd, body);
    return path;
  });
}

exports.createCompilationFile = createCompilationFile;