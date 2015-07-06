'use strict';

var _ = require('lodash');
var j = require('junify');

var syntax = require('./syntax');

var expectationChecker = {

  HasBinding: function (ast, binding) {
    return syntax.declarationsOf(ast).some(syntax.match([
      { type: 'FunctionDeclaration', id: syntax.identifier(binding), _: j._ },
      { type: 'VariableDeclarator', id: syntax.identifier(binding), _: j._ }
    ]));
  },

  HasUsage: function (ast, binding, target) {
    return syntax.expressionsOf(ast, binding).some(function (node) {
      return syntax.expressionHasUsage(node, target);
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
