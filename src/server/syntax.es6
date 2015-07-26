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
  return expressionsOf(ast, binding).some(function (node) {
    return explore(node, f);
  });
}

function hasDeclaration(ast, f) {
  return declarationsOf(ast).some(f);
}

//=======
//Private
//=======


// low level iteration

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

// Expressions exploration

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

module.exports = {
  identifier: identifier,
  hasExpression: hasExpression,
  hasDeclaration: hasDeclaration
};
