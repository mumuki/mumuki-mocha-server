'use strict';

Array.prototype.concatMap = function (f) {
  return Array.prototype.concat.apply([], this.map(f));
};

var should = require('should');

var esprima = require('esprima');
var j = require('junify');

var assert = require('assert');

function hasBinding(binding, ast) {
  return declarationsOf(ast).some(match([
    { type: 'FunctionDeclaration', id: identifier(binding), _: j._ },
    { type: 'VariableDeclarator', id: identifier(binding), init: j._ }
  ]));
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
    assert(hasBinding('foo', p('function foo(){}')));
  });

  it('not hasBinding when function declaration exist for other binding', function () {
    assert(!hasBinding('bar', p('function foo(){}')));
  });

  it('not hasBinding when code is empty', function () {
    assert(!hasBinding('bar', p('')));
  });

  it('hasBinding when code has variable for binding', function () {
    assert(hasBinding('bar', p('var bar = 4')));
  });

  it('not hasBinding when code has variable for other binding', function () {
    assert(!hasBinding('bar', p('var foo = 4')));
  });

  it('not hasBinding when code has expression', function () {
    assert(!hasBinding('bar', p('5 + 2')));
  });

  it('hasBinding for first declarator when code has multiple varible declarators', function () {
    assert(hasBinding('a', p('var a = 5, b = 2;')));
  });

  it('hasBinding for second declarator when code has multiple varible declarators', function () {
    assert(hasBinding('b', p('var a = 5, b = 2;')));
  });

});

describe('concatMap', function () {

  it('concatMap', function () {

    var concatMap = [{foo: [1,2]}, {foo: [3,4]}].concatMap(function (obj) { return obj.foo; });

    concatMap.should.be.eql([1,2,3,4]);

  });

});
