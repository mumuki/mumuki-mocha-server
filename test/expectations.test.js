'use strict';
var should = require('should');

var esprima = require('esprima');
var j = require('junify');

var assert = require('assert');

function HasBinding(binding, ast) {
  return declarationsOf(ast).some(function(it){
    return j.unify({
              type: 'FunctionDeclaration',
              id: { type: 'Identifier', name: binding },
              _: j._
            }, it)
        || j.unify({
              type: 'VariableDeclaration',
              declarations: [{
                type: 'VariableDeclarator',
                id: { type: 'Identifier', name: binding },
                init: j._ }],
              _: j._
            }, it);
  });
}

function declarationsOf(ast) {
  return ast.body.filter(function(it){
    return j.unify({type: 'VariableDeclaration', _: j._}, it)
        || j.unify({type: 'FunctionDeclaration', _: j._}, it);
  });
}

function p(code) {
  return esprima.parse(code)
}

describe('POST /test', function () {

  it("hasBinding when function declaration exists for binding", function(){
    assert(HasBinding('foo', p('function foo(){}')));
  })

  it("not hasBinding when function declaration exist for other binding", function(){
    assert(!HasBinding('bar', p('function foo(){}')));
  })

  it("not hasBinding when code is empty", function(){
    assert(!HasBinding('bar', p('')));
  })

  it("hasBinding when code has variable for binding", function(){
    assert(HasBinding('bar', p('var bar = 4')));
  })

  it("not hasBinding when code has variable for other binding", function(){
    assert(!HasBinding('bar', p('var foo = 4')));
  })

  it("not hasBinding when code has expression", function(){
    assert(!HasBinding('bar', p('5 + 2')));
  })
});
