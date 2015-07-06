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
  return j.match(arg, [
    j.case(type('CallExpression'), function (result) {
     return expressionHasUsage(arg.callee, target);
    }),
    j.case(type('BinaryExpression'), function (result) {
     return expressionHasUsage(arg.left, target) || expressionHasUsage(arg.right, target);
    }),
    j.case(type('ReturnStatement'), function (result) {
     return expressionHasUsage(arg.argument, target);
    }),
    j.case(type('ExpressionStatement'), function (result) {
     return expressionHasUsage(arg.expression, target);
    }),
    j.case(type('BlockStatement'), function (result) {
     return arg.body.some(function (it) {
       return expressionHasUsage(it, target);
     });
    }),
    j.case(type('VariableDeclaration'), function (result) {
     return arg.declarations.some(function (it) {
       return expressionHasUsage(it, target);
     });
    }),
    j.case(type('VariableDeclarator'), function (result) {
     return expressionHasUsage(arg.init, target);
    }),
    j.case(identifier(target), _.constant(true)),
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
