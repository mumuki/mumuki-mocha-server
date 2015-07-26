'use strict';

let esprima = require('esprima');

let expectationChecker = require('./expectation-checker');

function checkExpectations(expectations, f) {
  return expectations.map((expectation) => ({
    result: f(expectation),
    expectation: expectation
  }));
}

function checkerFor(content) {
  try {
    let ast = esprima.parse(content);
    return (e) => expectationChecker.isValid(ast, e);
  } catch (err) {
    return () => false;
  }
}

module.exports = {

  check: (content, expectations) => checkExpectations(expectations, checkerFor(content))

};
