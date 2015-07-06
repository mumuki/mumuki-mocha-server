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
  return matches(arg, [
    [{ type: 'CallExpression', callee: j.variable('sub'), _: j._ }, function (result) {
      return expressionHasUsage(result.sub, target);
    }],
    [{ type: 'BinaryExpression', operator: j._, left: j.variable('sub1'), right: j.variable('sub2') }, function (result) {
      return expressionHasUsage(result.sub1, target) || expressionHasUsage(result.sub2, target);
    }],
    [{ type: 'ReturnStatement', argument: j.variable('sub'), _: j._ }, function (result) {
      return expressionHasUsage(result.sub, target);
    }],
    [{ type: 'ExpressionStatement', expression: j.variable('sub'), _: j._ }, function (result) {
      return expressionHasUsage(result.sub, target);
    }],
    [{ type: 'BlockStatement', body: j.variable('sub'), _: j._ }, function (result) {
      return result.sub.some(function (it) {
        return expressionHasUsage(it, target);
      });
    }],
    [{ type: 'VariableDeclaration', declarations: j.variable('sub'), _: j._ }, function (result) {
      return result.sub.some(function (it) {
        return expressionHasUsage(it, target);
      });
    }],
    [{ type: 'VariableDeclarator', init: j.variable('sub'), _: j._ }, function (result) {
      return expressionHasUsage(result.sub, target);
    }],
    [{ type: 'Identifier', name: j.variable('sub'), _: j._ }, function (result) {
      return result.sub === target;
    }],
    [j._, _.constant(false)],
  ]);
}

function match(patterns) {
  return function (it) {
    return patterns.some(function (pattern) {
      return  j.unify(pattern, it);
    });
  };
}

function identifier(binding) {
  return { type: 'Identifier', name: binding };
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

function matches(arg, cases) {
  for (var i = 0; i < cases.length; i++) {
    var pattern = cases[i][0];
    var callback = cases[i][1];
    var match = j.unify(pattern, arg);
    if (match) {
      return callback(match);
    }
  }
  throw new Error('Pattern matchnig error ' + JSON.stringify(arg));
}

module.exports = {
  match: match,
  matches: matches,
  identifier: identifier,
  expressionsOf: expressionsOf,
  declarationsOf: declarationsOf,
  expressionHasUsage: expressionHasUsage
};
