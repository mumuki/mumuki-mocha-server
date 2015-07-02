'use strict';

var _ = require('lodash');

var expectationChecker = {

  HasBinding: function (astNode) {
    return !_.isEmpty(astNode);
  },

  HasUsage: function (astNode, target) {
    var node = JSON.stringify(astNode);
    var regExp = new RegExp('"callee":{"type":"Identifier","name":"' + target.trim() + '"}');
    return !_.isEmpty(astNode) && regExp.test(node);
  },

  Default: function () {
    return true;
  }

};

function isNot(value) {
  return /not/i.test(value);
}

function lookup(ast, binding) {
  var programStatements = ast.body;
  return _.find(programStatements, { id: { type: 'Identifier', name: binding } });
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

function checkExpectation(astNode, inspection) {
  var checker = expectationChecker[inspection.type] || expectationChecker.Default;
  return checker(astNode, inspection.target);
}

module.exports = {

  isValid: function (ast, expectation) {
    var astNode = lookup(ast, expectation.binding);
    var inspection = getInspection(expectation);

    return inspection.getResult(checkExpectation(astNode, inspection));
  }

};
