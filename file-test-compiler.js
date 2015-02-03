var fs = require('fs');
var tmp = require('tmp');
function createCompilationFile(body) {
  var final_path = "/tmp";
  tmp.file({postfix: '.js'}, function _tempFileCreated(err, path, fd) {
    //fs.write(fd, "var assert = require('assert');");
    /*console.log("var assert = require('assert');");
    console.log(body.content);
    console.log(body.test);*/
    fs.write(fd, body.content);
    fs.write(fd, body.test);
    final_path = path;
    console.log(final_path);
    });
}

exports.createCompilationFile = createCompilationFile;