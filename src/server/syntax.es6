'use strict';

let _ = require('lodash');
let j = require('junify');
let esprima = require('esprima');

let extensions = require('./extensions');

//======
//Public
//======


// common patterns

function identifier(binding) {
  return { type: 'Identifier', name: binding };
}

function type(t) {
  return { type: t, _: j._ };
}

// predicates

function hasExpression(ast, binding, f) {
  return expressionsOf(ast, binding).some((node) => explore(node, f));
}

function hasDeclaration(ast, f) {
  return declarationsOf(ast).some(f);
}

//=======
//Private
//=======


// low level iteration

function expressionsOf(ast, binding) {
  return declarationsOf(ast).concatMap((node) =>
    j.match(node, [
      j.case({ type: 'FunctionDeclaration', id: identifier(binding), _: j._ }, () => [node.body]),
      j.case({ type: 'VariableDeclarator' , id: identifier(binding), _: j._ }, () => [node.init]),
      j.case(j._, () => [])
    ]));
}


function declarationsOf(ast) {
  return ast.body.concatMap((node) =>
    j.match(node, [
      j.case(type('FunctionDeclaration'), () => [node]),
      j.case(type('VariableDeclaration'), () => node.declarations),
      j.case(j._, () => [])
    ]));
}

// Expressions exploration

function explore(arg, f) {
  return f(arg) || subExpressionsOf(arg).some((subExpression) => explore(subExpression, f));
}

function subExpressionsOf(exp) {
  return j.match(exp, [
    j.case(type('CallExpression')     , () => [exp.callee]),
    j.case(type('BinaryExpression')   , () => [exp.left, exp.right]),
    j.case(type('ReturnStatement')    , () => [exp.argument]),
    j.case(type('ExpressionStatement'), () => [exp.expression]),
    j.case(type('BlockStatement')     , () => exp.body),
    j.case(type('VariableDeclaration'), () => exp.declarations),
    j.case(type('VariableDeclarator') , () => [exp.init]),
    j.case(j._                        , () => [])
  ]);
}

module.exports = {
  identifier: identifier,
  hasExpression: hasExpression,
  hasDeclaration: hasDeclaration
};
