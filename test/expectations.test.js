'use strict';

Array.prototype.concatMap = function (f) {
  return Array.prototype.concat.apply([], this.map(f));
};

var should = require('should');

var esprima = require('esprima');
var j = require('junify');

var assert = require('assert');

// Public
function hasBinding(ast, binding) {
  return declarationsOf(ast).some(match([
    { type: 'FunctionDeclaration', id: identifier(binding), _: j._ },
    { type: 'VariableDeclarator', id: identifier(binding), _: j._ }
  ]));
}

function hasUsage(ast, binding, target) {
  return declarationsOf(ast).some(function (declaration) {
    if (j.unify({ type: 'FunctionDeclaration', id: identifier(binding), _: j._ }, declaration)) {
      return declaration.body.body.some(function (statement) {
        var patternBinding = j.unify({ type: 'ReturnStatement', argument: j.variable('expression'), _: j._ }, statement) ||
                             j.unify({ type: 'ExpressionStatement', expression: j.variable('expression'), _: j._ }, statement);
          if (patternBinding) {
            return expressionHasUsage(patternBinding.expression, target);
          }
      });
    }
  });
}

// Private
function expressionHasUsage(arg, target) {
  return match([
    identifier(target),
    { type: 'CallExpression', callee: identifier(target), _: j._ },
    { type: 'BinaryExpression', operator: j._, left: j._, right: identifier(target) },
    { type: 'BinaryExpression', operator: j._, left: identifier(target), right: j._ }
  ])(arg);
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

function p(code) {
  return esprima.parse(code);
}

describe('hasBinding', function () {

  it('hasBinding when function declaration exists for binding', function () {
    assert(hasBinding(p('function foo(){}'), 'foo'));
  });

  it('not hasBinding when function declaration exist for other binding', function () {
    assert(!hasBinding(p('function foo(){}'), 'bar'));
  });

  it('not hasBinding when code is empty', function () {
    assert(!hasBinding(p(''), 'bar'));
  });

  it('hasBinding when code has variable for binding', function () {
    assert(hasBinding(p('var bar = 4'), 'bar'));
  });

  it('not hasBinding when code has variable for other binding', function () {
    assert(!hasBinding(p('var foo = 4'), 'bar'));
  });

  it('not hasBinding when code has expression', function () {
    assert(!hasBinding(p('5 + 2'), 'bar'));
  });

  it('hasBinding for first declarator when code has multiple varible declarators', function () {
    assert(hasBinding(p('var a = 5, b = 2;'), 'a'));
  });

  it('hasBinding for second declarator when code has multiple varible declarators', function () {
    assert(hasBinding(p('var a = 5, b = 2;'), 'b'));
  });

});

describe('hasUsage', function () {

  it('when target is in binding return statement', function () {
    assert(hasUsage(p('function foo() { return bar; }'), 'foo', 'bar'));
  });

  it('when target is applied in binding return statement', function () {
    assert(hasUsage(p('function foo() { return bar(); }'), 'foo', 'bar'));
  });

  it('when target is applied with arguments in binding return statement', function () {
    assert(hasUsage(p('function foo() { return bar(1,2,3); }'), 'foo', 'bar'));
  });

  it('when target is in binary binding return statement', function () {
    assert(hasUsage(p('function foo() { return 1 + bar; }'), 'foo', 'bar'));
  });

  it('when target is in binary binding return statement', function () {
    assert(hasUsage(p('function foo() { return bar + 1; }'), 'foo', 'bar'));
  });

  it('when target is not in binding return statement', function () {
    assert(!hasUsage(p('function foo() { return baz(); }'), 'foo', 'bar'));
  });

  it('when binding does not exist', function () {
    assert(!hasUsage(p('5 + 2;'), 'foo', 'bar'));
  });

  it('when target is applied with arguments in binding expression statement', function () {
    assert(hasUsage(p('function foo() { bar(1,2,3); }'), 'foo', 'bar'));
  });

  it('when target is in binary binding expression statement', function () {
    assert(hasUsage(p('function foo() { 1 + bar; }'), 'foo', 'bar'));
  });

  it('when target is in binary binding expression statement', function () {
    assert(hasUsage(p('function foo() { bar + 1; }'), 'foo', 'bar'));
  });

});

describe('concatMap', function () {

  it('concatMap', function () {

    var concatMap = [{foo: [1,2]}, {foo: [3,4]}].concatMap(function (obj) { return obj.foo; });

    concatMap.should.be.eql([1,2,3,4]);

  });

});
