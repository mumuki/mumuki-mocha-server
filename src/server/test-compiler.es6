'use strict';

let fs = require('fs');
let tmp = require('tmp');
let Bluebird = require('bluebird');

let expectations = require('./test-expectations');

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
  return `
    var assert = require("assert");
    require = function() { throw new Error("require not available") };
    module.require = require;
    eval = function() { throw new Error("eval not available") };

    ${body.extra}
    ${body.content}
    ${body.test}`;
}

exports.createCompilationFile = createCompilationFile;
