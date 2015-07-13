'use strict';

var _ = require('lodash');
var j = require('junify');

var syntax = require('./syntax');

var expectationChecker = {

  HasBinding: function (ast, binding) {
    return syntax.hasDeclaration(ast, j.matchesAny([
      { type: 'FunctionDeclaration', id: syntax.identifier(binding), _: j._ },
      { type: 'VariableDeclarator', id: syntax.identifier(binding), _: j._ }
    ]));
  },

  HasUsage: function (ast, binding, target) {
    return syntax.hasExpression(ast, binding, function (expression) {
      return j.match(expression, [
        j.case(syntax.identifier(target), _.constant(true)),
        j.case(j._                      , _.constant(false))
      ]);
    });
  },

  Default: function () {
    return true;
  }

};

function isNot(value) {
  return /not/i.test(value);
}

function getInspection(expectation) {
  var inspection = expectation.inspection.split(':');
  var not = inspection[0];
  return {
    type: inspection[isNot(not) ? 1 : 0],
    target: inspection[isNot(not) ? 2 : 1],
    getResult: function (bool) {
      return isNot(not) ? !bool : bool;
    }
  };
}

function checkExpectation(ast, binding, inspection) {
  var checker = expectationChecker[inspection.type] || expectationChecker.Default;
  return checker(ast, binding, inspection.target);
}

module.exports = {

  isValid: function (ast, expectation) {
    var inspection = getInspection(expectation);
    return inspection.getResult(checkExpectation(ast, expectation.binding, inspection));
  }

};
