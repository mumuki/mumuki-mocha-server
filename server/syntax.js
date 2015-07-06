'use strict';

var _ = require('lodash');
var j = require('junify');
var esprima = require('esprima');

var extensions = require('./extensions');

function expressionsOf(ast, binding) {
  return declarationsOf(ast).concatMap(function (node) {
    return j.match(node, [
      j.case({ type: 'FunctionDeclaration', id: identifier(binding), _: j._ }, function () {
        return [node.body];
      }),
      j.case({ type: 'VariableDeclarator', id: identifier(binding), _: j._ }, function () {
        return [node.init];
      }),
      j.case(j._, _.constant([]))
    ]);
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
  return f(arg) || subExpressionsOf(arg).some(function (subExpression) {
    return explore(subExpression, f);
  });
}

function subExpressionsOf(exp) {
  return j.match(exp, [
    j.case(type('CallExpression'), function () {
     return [exp.callee];
    }),
    j.case(type('BinaryExpression'), function () {
     return [exp.left, exp.right];
    }),
    j.case(type('ReturnStatement'), function () {
     return [exp.argument];
    }),
    j.case(type('ExpressionStatement'), function () {
     return [exp.expression];
    }),
    j.case(type('BlockStatement'), function () {
     return exp.body;
    }),
    j.case(type('VariableDeclaration'), function () {
     return exp.declarations;
    }),
    j.case(type('VariableDeclarator'), function () {
     return [exp.init];
    }),
    j.case(j._, _.constant([]))
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
    return j.match(node, [
      j.case(type('FunctionDeclaration'), function () {
        return [node];
      }),
      j.case(type('VariableDeclaration'), function () {
        return node.declarations;
      }),
      j.case(j._ , function () {
        return [];
      })
    ]);
  });
}

module.exports = {
  identifier: identifier,
  expressionsOf: expressionsOf,
  declarationsOf: declarationsOf,
  expressionHasUsage: expressionHasUsage
};
