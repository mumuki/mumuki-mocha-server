'use strict';

var esprima = require('esprima');

var expectationChecker = require('./expectation-checker');

module.exports = {

  check: function (content, expectations) {

    var ast = esprima.parse(content);

    return expectations.map(function (expectation) {
      return {
        result: expectationChecker.isValid(ast, expectation),
        expectation: expectation
      };
    });
  }

};
