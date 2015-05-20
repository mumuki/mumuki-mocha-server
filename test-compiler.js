var fs = require('fs');
var tmp = require('tmp');

function createCompilationFile(body, done) {
  tmp.file(function(err, path, fd) {
    fs.writeFile(path, compile(body), function(){
      done(path);
    });
  });
}

function compile(body) {
  var requires = "var assert = require('assert');";

  return requires +'\n'+
         body.extra + '\n' +
         body.content + '\n' +
         body.test
}

exports.createCompilationFile = createCompilationFile;
