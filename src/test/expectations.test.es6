'use strict';

let should = require('should');
let assert = require('assert');
let esprima = require('esprima');

let Check = require('../server/expectation-checker');

function p(code) {
  return esprima.parse(code);
}

describe('hasBinding', () => {

  function hasBinding(code, binding) {
    return Check.isValid(p(code), {
      binding: binding,
      inspection: 'HasBinding'
    });
  }

  it('hasBinding when function declaration exists for binding', () => {
    assert(hasBinding('function foo(){}', 'foo'));
  });

  it('not hasBinding when function declaration exist for other binding', () => {
    assert(!hasBinding('function foo(){}', 'bar'));
  });

  it('not hasBinding when code is empty', () => {
    assert(!hasBinding('', 'bar'));
  });

  it('hasBinding when code has variable for binding', () => {
    assert(hasBinding('var bar = 4', 'bar'));
  });

  it('not hasBinding when code has variable for other binding', () => {
    assert(!hasBinding('var foo = 4', 'bar'));
  });

  it('not hasBinding when code has expression', () => {
    assert(!hasBinding('5 + 2', 'bar'));
  });

  it('hasBinding for first declarator when code has multiple varible declarators', () => {
    assert(hasBinding('var a = 5, b = 2;', 'a'));
  });

  it('hasBinding for second declarator when code has multiple varible declarators', () => {
    assert(hasBinding('var a = 5, b = 2;', 'b'));
  });

});

describe('hasUsage', () => {

  function hasUsage(code, binding, target) {
    return Check.isValid(p(code), {
      binding: binding,
      inspection: 'HasUsage:' + target
    });
  }

  it('when target is in binding return statement', () => {
    assert(hasUsage('function foo() { return bar; }', 'foo', 'bar'));
  });

  it('when target is not in binding return statement', () => {
    assert(!hasUsage('function foo() { return baz; }', 'foo', 'bar'));
  });

  it('when target is applied in binding return statement', () => {
    assert(hasUsage('function foo() { return bar(); }', 'foo', 'bar'));
  });

  it('when target is applied with arguments in binding return statement', () => {
    assert(hasUsage('function foo() { return bar(1,2,3); }', 'foo', 'bar'));
  });

  it('when target is in binary binding return statement', () => {
    assert(hasUsage('function foo() { return 1 + bar; }', 'foo', 'bar'));
  });

  it('when target is in binary binding return statement', () => {
    assert(hasUsage('function foo() { return bar + 1; }', 'foo', 'bar'));
  });

  it('when target is not in binding return statement', () => {
    assert(!hasUsage('function foo() { return baz(); }', 'foo', 'bar'));
  });

  it('when target is applied with arguments in binding expression statement', () => {
    assert(hasUsage('function foo() { bar(1,2,3); }', 'foo', 'bar'));
  });

  it('when target is in binary binding expression statement', () => {
    assert(hasUsage('function foo() { 1 + bar; }', 'foo', 'bar'));
  });

  it('when target is in binary binding expression statement', () => {
    assert(hasUsage('function foo() { bar + 1; }', 'foo', 'bar'));
  });

  it('when target is in variable statement in function declaration', () => {
    assert(hasUsage('function foo() { var x = bar; }', 'foo', 'bar'));
  });

  it('when target is not in variable statement in function declaration', () => {
    assert(!hasUsage('function foo() { var bar = 2; }', 'foo', 'bar'));
  });

  it('when target is not in binary binding expression statement', () => {
    assert(!hasUsage('function foo() { 3 + 1; }', 'foo', 'bar'));
  });

  it('when target is in init statement of binding variable', () => {
    assert(hasUsage('var foo = bar;', 'foo', 'bar'));
  });

  it('when target is not in init statement of binding variable', () => {
    assert(!hasUsage('var foo = 4;', 'foo', 'bar'));
  });

  it('when target is not in empty init statement of binding variable', () => {
    assert(!hasUsage('var foo;', 'foo', 'bar'));
  });

  it('when binding does not exist', () => {
    assert(!hasUsage('5 + 2;', 'foo', 'bar'));
  });

});

describe('hasArity', () => {

  function hasArity(code, binding, target) {
    return Check.isValid(p(code), {
      binding: binding,
      inspection: 'HasArity:' + target
    });
  }

  it('should work with foo/0 and target 0', () => {
    assert(hasArity('function foo() {}', 'foo', 0));
  });

  it('should not work with foo/0 and target 1', () => {
    assert(!hasArity('function foo() {}', 'foo', 1));
  });

  it('should work with foo/2 and target 2', () => {
    assert(hasArity('function foo(bar, baz) {}', 'foo', 2));
  });

  it('should not work with foo/2 and target 1', () => {
    assert(!hasArity('function foo(bar, baz) {}', 'foo', 1));
  });

  it('should work with function variable foo/0 and target 0', () => {
    assert(hasArity('var foo = function () {}', 'foo', 0));
  });

  it('should not work with function variable foo/0 and target 1', () => {
    assert(!hasArity('var foo = function () {}', 'foo', 1));
  });

  it('should work with function variable foo/2 and target 2', () => {
    assert(hasArity('var foo = function (bar, baz) {}', 'foo', 2));
  });

  it('should not work with function variable foo/2 and target 1', () => {
    assert(!hasArity('var foo = function (bar, baz) {}', 'foo', 1));
  });

  it('should not work with constant variable foo and target 1', () => {
    assert(!hasArity('var foo = 1', 'foo', 0));
  });

});
