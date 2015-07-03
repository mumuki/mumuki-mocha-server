'use strict';

var should = require('should');

var esprima = require('esprima');
var j = require('junify');

var assert = require('assert');

function match(patterns) {
  return function(it) {
    return patterns.some(function(pattern) {
      return  j.unify(pattern, it);
    });
  };
}

function identifier(binding) {
  return { type: 'Identifier', name: binding };
}

function hasBinding(binding, ast) {
  return declarationsOf(ast).some(match([
    { type: 'FunctionDeclaration', id: identifier(binding), _: j._ },
    {
      type: 'VariableDeclaration',
      declarations: [{
        type: 'VariableDeclarator',
        id: identifier(binding),
        init: j._ }],
        _: j._
      }]));
}

function declarationsOf(ast) {
  return ast.body.filter(match([
    {type: 'VariableDeclaration', _: j._},
    {type: 'FunctionDeclaration', _: j._}]));
}

function p(code) {
  return esprima.parse(code);
}

describe('hasBinding', function () {

  it('hasBinding when function declaration exists for binding', function(){
    assert(hasBinding('foo', p('function foo(){}')));
  });

  it('not hasBinding when function declaration exist for other binding', function(){
    assert(!hasBinding('bar', p('function foo(){}')));
  });

  it('not hasBinding when code is empty', function(){
    assert(!hasBinding('bar', p('')));
  });

  it('hasBinding when code has variable for binding', function(){
    assert(hasBinding('bar', p('var bar = 4')));
  });

  it('not hasBinding when code has variable for other binding', function(){
    assert(!hasBinding('bar', p('var foo = 4')));
  });

  it('not hasBinding when code has expression', function(){
    assert(!hasBinding('bar', p('5 + 2')));
  });
});
