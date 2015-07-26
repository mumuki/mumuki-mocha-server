'use strict';

let esprima = require('esprima');

let expectationChecker = require('./expectation-checker');

function checkExpectations(expectations, f) {
  return expectations.map(function (expectation) {
    return {
      result: f(expectation),
      expectation: expectation
    };
  })
}

function checkerFor(content) {
  try {
    let ast = esprima.parse(content);
    return function (e) {
      return expectationChecker.isValid(ast, e);
    };
  } catch (err) {
    return function () {
      return false;
    };
  }
}

module.exports = {

  check: function (content, expectations) {
    return checkExpectations(expectations, checkerFor(content));
  }

};
