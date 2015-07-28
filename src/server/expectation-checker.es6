'use strict';

let _ = require('lodash');
let j = require('junify');

let syntax = require('./syntax');

let expectationChecker = {

  HasBinding: (ast, binding) =>
    syntax.hasDeclaration(ast, j.matchesAny([
      syntax.declarationId('FunctionDeclaration', binding),
      syntax.declarationId('VariableDeclarator', binding)
    ])),

  HasUsage: (ast, binding, target) =>
    syntax.hasExpression(ast, binding, (expression) =>
      j.match(expression, [
        j.case(syntax.identifier(target), () => true),
        j.case(j._                      , () => false)
      ])),

  HasArity: (ast, binding, target) =>
    syntax.hasDeclaration(ast, j.matchesAny([
      syntax.declarationId('FunctionDeclaration', binding, params(target)),
      syntax.declarationId('VariableDeclarator' , binding, { init: params(target) })
    ])),

  Default: () => true

};

function params(target) {
  return { params: syntax.arrayLength(target), _: j._ };
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
