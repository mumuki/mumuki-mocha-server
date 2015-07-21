'use strict';

var fs = require('fs');
var tmp = require('tmp');
var Bluebird = require('bluebird');

var expectations = require('./test-expectations');

Bluebird.promisifyAll(fs);
Bluebird.promisifyAll(tmp);

function createCompilationFile(body) {
  return Bluebird.props({
      filepath: Bluebird.join(tmp.fileAsync().get(0), compile(body), writeContent),
      expectationResults: expectations.check(body.content, body.expectations)
    });
}

function writeContent(path, content) {
  return fs.writeFileAsync(path, content).thenReturn(path);
}

function compile(body) {
  var requires = 'var assert = require("assert");';

  return requires +'\n'+
         body.extra + '\n' +
         body.content + '\n' +
         body.test;
}

exports.createCompilationFile = createCompilationFile;
