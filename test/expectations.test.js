'use strict';

var should = require('should');
var assert = require('assert');
var esprima = require('esprima');

var Check = require('../server/expectation-checker');

function p(code) {
  return esprima.parse(code);
}

describe('hasBinding', function () {

  function hasBinding(code, binding) {
    return Check.isValid(p(code), {
      binding: binding,
      inspection: 'HasBinding'
    });
  }

  it('hasBinding when function declaration exists for binding', function () {
    assert(hasBinding('function foo(){}', 'foo'));
  });

  it('not hasBinding when function declaration exist for other binding', function () {
    assert(!hasBinding('function foo(){}', 'bar'));
  });

  it('not hasBinding when code is empty', function () {
    assert(!hasBinding('', 'bar'));
  });

  it('hasBinding when code has variable for binding', function () {
    assert(hasBinding('var bar = 4', 'bar'));
  });

  it('not hasBinding when code has variable for other binding', function () {
    assert(!hasBinding('var foo = 4', 'bar'));
  });

  it('not hasBinding when code has expression', function () {
    assert(!hasBinding('5 + 2', 'bar'));
  });

  it('hasBinding for first declarator when code has multiple varible declarators', function () {
    assert(hasBinding('var a = 5, b = 2;', 'a'));
  });

  it('hasBinding for second declarator when code has multiple varible declarators', function () {
    assert(hasBinding('var a = 5, b = 2;', 'b'));
  });

});

describe('hasUsage', function () {

  function hasUsage(code, binding, target) {
    return Check.isValid(p(code), {
      binding: binding,
      inspection: 'HasUsage:' + target
    });
  }

  it('when target is in binding return statement', function () {
    assert(hasUsage('function foo() { return bar; }', 'foo', 'bar'));
  });

  it('when target is not in binding return statement', function () {
    assert(!hasUsage('function foo() { return baz; }', 'foo', 'bar'));
  });

  it('when target is applied in binding return statement', function () {
    assert(hasUsage('function foo() { return bar(); }', 'foo', 'bar'));
  });

  it('when target is applied with arguments in binding return statement', function () {
    assert(hasUsage('function foo() { return bar(1,2,3); }', 'foo', 'bar'));
  });

  it('when target is in binary binding return statement', function () {
    assert(hasUsage('function foo() { return 1 + bar; }', 'foo', 'bar'));
  });

  it('when target is in binary binding return statement', function () {
    assert(hasUsage('function foo() { return bar + 1; }', 'foo', 'bar'));
  });

  it('when target is not in binding return statement', function () {
    assert(!hasUsage('function foo() { return baz(); }', 'foo', 'bar'));
  });

  it('when target is applied with arguments in binding expression statement', function () {
    assert(hasUsage('function foo() { bar(1,2,3); }', 'foo', 'bar'));
  });

  it('when target is in binary binding expression statement', function () {
    assert(hasUsage('function foo() { 1 + bar; }', 'foo', 'bar'));
  });

  it('when target is in binary binding expression statement', function () {
    assert(hasUsage('function foo() { bar + 1; }', 'foo', 'bar'));
  });

  it('when target is in variable statement in function declaration', function () {
    assert(hasUsage('function foo() { var x = bar; }', 'foo', 'bar'));
  });

  it('when target is not in variable statement in function declaration', function () {
    assert(!hasUsage('function foo() { var bar = 2; }', 'foo', 'bar'));
  });

  it('when target is not in binary binding expression statement', function () {
    assert(!hasUsage('function foo() { 3 + 1; }', 'foo', 'bar'));
  });

  it('when target is in init statement of binding variable', function () {
    assert(hasUsage('var foo = bar;', 'foo', 'bar'));
  });

  it('when target is not in init statement of binding variable', function () {
    assert(!hasUsage('var foo = 4;', 'foo', 'bar'));
  });

  it('when target is not in empty init statement of binding variable', function () {
    assert(!hasUsage('var foo;', 'foo', 'bar'));
  });

  it('when binding does not exist', function () {
    assert(!hasUsage('5 + 2;', 'foo', 'bar'));
  });

});
