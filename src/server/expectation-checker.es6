'use strict';

let _ = require('lodash');
let j = require('junify');

let syntax = require('./syntax');

let expectationChecker = {

  HasBinding: (ast, binding) =>
    syntax.hasDeclaration(ast, j.matchesAny([
      { type: 'FunctionDeclaration', id: syntax.identifier(binding), _: j._ },
      { type: 'VariableDeclarator' , id: syntax.identifier(binding), _: j._ }
    ])),

  HasUsage: (ast, binding, target) =>
    syntax.hasExpression(ast, binding, (expression) =>
      j.match(expression, [
        j.case(syntax.identifier(target), () => true),
        j.case(j._                      , () => false)
      ])),

  HasArity: (ast, binding, target) =>
    syntax.hasDeclaration(ast, j.matchesAny([
      { type: 'FunctionDeclaration', id: syntax.identifier(binding), params: matchArray(target), _: j._ },
      { type: 'VariableDeclarator' , id: syntax.identifier(binding), init: { params: matchArray(target), _: j._ }, _: j._ },
    ])),

  Default: () => true

};

function matchArray(times) {
  return _.times(times, () => j._);
}

function isNot(value) {
  return /not/i.test(value);
}

function getInspection(expectation) {
  let inspection = expectation.inspection.split(':');
  let not = inspection[0];
  return {
    type: inspection[isNot(not) ? 1 : 0],
    target: inspection[isNot(not) ? 2 : 1],
    getResult: (bool) => isNot(not) ? !bool : bool
  };
}

function checkExpectation(ast, binding, inspection) {
  let checker = expectationChecker[inspection.type] || expectationChecker.Default;
  return checker(ast, binding, inspection.target);
}

module.exports = {

  isValid: (ast, expectation) => {
    let inspection = getInspection(expectation);
    return inspection.getResult(checkExpectation(ast, expectation.binding, inspection));
  }

};
