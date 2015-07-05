'use strict';

Array.prototype.concatMap = function (f) {
  return Array.prototype.concat.apply([], this.map(f));
};

var should = require('should');

var esprima = require('esprima');
var j = require('junify');
var _ = require('lodash');

var assert = require('assert');

// Public
function hasBinding(ast, binding) {
  return declarationsOf(ast).some(match([
    { type: 'FunctionDeclaration', id: identifier(binding), _: j._ },
    { type: 'VariableDeclarator', id: identifier(binding), _: j._ }
  ]));
}

function hasUsage(ast, binding, target) {
  return expressionsOf(ast, binding).some(function (node) {
    return expressionHasUsage(node, target);
  });
}

// Private
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

function extract(ast, patterns) {
  return patterns.reduce(function (accum, pattern) {
    return accum || j.unify(pattern, ast);
  }, false);
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
    [identifier(target), _.constant(true)],
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

function p(code) {
  return esprima.parse(code);
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

  it('when target is not in binding return statement', function () {
    assert(!hasUsage(p('function foo() { return baz; }'), 'foo', 'bar'));
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

  it('when target is applied with arguments in binding expression statement', function () {
    assert(hasUsage(p('function foo() { bar(1,2,3); }'), 'foo', 'bar'));
  });

  it('when target is in binary binding expression statement', function () {
    assert(hasUsage(p('function foo() { 1 + bar; }'), 'foo', 'bar'));
  });

  it('when target is in binary binding expression statement', function () {
    assert(hasUsage(p('function foo() { bar + 1; }'), 'foo', 'bar'));
  });

  it('when target is in variable statement in function declaration', function () {
    assert(hasUsage(p('function foo() { var x = bar; }'), 'foo', 'bar'));
  });

  it('when target is not in variable statement in function declaration', function () {
    assert(!hasUsage(p('function foo() { var bar = 2; }'), 'foo', 'bar'));
  });

  it('when target is not in binary binding expression statement', function () {
    assert(!hasUsage(p('function foo() { 3 + 1; }'), 'foo', 'bar'));
  });

  it('when target is in init statement of binding variable', function () {
    assert(hasUsage(p('var foo = bar;'), 'foo', 'bar'));
  });

  it('when target is not in init statement of binding variable', function () {
    assert(!hasUsage(p('var foo = 4;'), 'foo', 'bar'));
  });

  it('when target is not in empty init statement of binding variable', function () {
    assert(!hasUsage(p('var foo;'), 'foo', 'bar'));
  });

  it('when binding does not exist', function () {
    assert(!hasUsage(p('5 + 2;'), 'foo', 'bar'));
  });

});

describe('utils', function () {

  it('concatMap', function () {

    var concatMap = [{foo: [1,2]}, {foo: [3,4]}].concatMap(function (obj) { return obj.foo; });

    concatMap.should.be.eql([1,2,3,4]);

  });

  it('extract', function () {
    var binding = extract({ foo: 'bar' }, [{ foo: j.variable('exp') }]);
    binding.should.be.eql({ exp: 'bar' });
  });

});
