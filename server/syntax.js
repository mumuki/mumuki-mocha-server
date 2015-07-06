'use strict';

var _ = require('lodash');
var j = require('junify');
var esprima = require('esprima');

var extensions = require('./extensions');

function expressionsOf(ast, binding) {
  return declarationsOf(ast).concatMap(function (node) {
    if (j.unify({ type: 'FunctionDeclaration', id: identifier(binding), _: j._ }, node)) {
      return [node.body];
    } else if (j.unify({ type: 'VariableDeclarator', id: identifier(binding), _: j._ }, node)) {
      return [node.init];
    } else {
      return [];
    }
  });
}

function expressionHasUsage(arg, target) {
  return explore(arg, function (expression) {
    return j.match(expression, [
      j.case(identifier(target), _.constant(true)),
      j.case(j._,                _.constant(false))
    ]);
  });
}

function explore(arg, f) {
  return f(arg) || j.match(arg, [
    j.case(type('CallExpression'), function (result) {
     return explore(arg.callee, f);
    }),
    j.case(type('BinaryExpression'), function (result) {
     return explore(arg.left, f) || explore(arg.right, f);
    }),
    j.case(type('ReturnStatement'), function (result) {
     return explore(arg.argument, f);
    }),
    j.case(type('ExpressionStatement'), function (result) {
     return explore(arg.expression, f);
    }),
    j.case(type('BlockStatement'), function (result) {
     return arg.body.some(function (it) {
       return explore(it, f);
     });
    }),
    j.case(type('VariableDeclaration'), function (result) {
     return arg.declarations.some(function (it) {
       return explore(it, f);
     });
    }),
    j.case(type('VariableDeclarator'), function (result) {
     return explore(arg.init, f);
    }),
    j.case(j._, _.constant(false))
  ]);
}

function identifier(binding) {
  return { type: 'Identifier', name: binding };
}

function type(t) {
  return { type: t, _: j._ };
}

function declarationsOf(ast) {
  return ast.body.concatMap(function (node) {
    if (j.unify({ type: 'FunctionDeclaration', _: j._ }, node)) {
      return [node];
    } else if (j.unify({ type: 'VariableDeclaration', _: j._ }, node)) {
      return node.declarations;
    } else {
      return [];
    }
  });
}

module.exports = {
  identifier: identifier,
  expressionsOf: expressionsOf,
  declarationsOf: declarationsOf,
  expressionHasUsage: expressionHasUsage
};
