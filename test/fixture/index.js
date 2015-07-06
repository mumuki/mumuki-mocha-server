'use strict';

module.exports = {
  basic : {
    ok: {
      body: {
        test: [
          'describe("Test True", function() {',
          '  it("should returns true", function() {',
          '    assert(testTrue());',
          '  });',
          '});'
        ].join('\n'),
        extra: '',
        content: [
          'function testTrue() {',
          '  return true;',
          '}'
        ].join('\n'),
        expectations: []
      },
      expected: {
        exit: 'passed',
        out: /1 passing \(\d+ms\)/
      }
    },
    fail: {
      body: {
        test: [
          'describe("Test True", function() {',
          '  it("should returns true", function() {',
          '    assert(testTrue());',
          '  });',
          '});'
        ].join('\n'),
        extra: '',
        content: [
          'function testTrue() {',
          '  return false;',
          '}'
        ].join('\n'),
        expectations: []
      },
      expected: {
        exit: 'failed',
        out: /0 passing \(\d+ms\)\s+1 failing/
      }
    }
  },
  withExpectation : {
    ok: {
      body: {
        test: [
          'describe("haceFrioF", function() {',
          '  it("212 °F no es frio", function() {',
          '    assert(!haceFrioF(212));',
          '  });',
          '  it("104 °F no es frio", function() {',
          '    assert(!haceFrioF(104));',
          '  });',
          '  it("50 °F no es frio", function() {',
          '    assert(!haceFrioF(50));',
          '  });',
          '  it("5 °F es frio", function() {',
          '    assert(haceFrioF(5));',
          '  });',
          '});'
        ].join('\n'),
        extra: [
          'function fahrToCelsius(temp) {',
          '  return (temp - 32) * 5 / 9;',
          '}'
        ].join('\n'),
        content: [
          'function haceFrioF(temp) {',
          '  return 8 > fahrToCelsius(temp);',
          '}'
        ].join('\n'),
        expectations:[
          { binding: 'haceFrioF', inspection: 'HasBinding' },
          { binding: 'haceFrioF', inspection: 'HasUsage:fahrToCelsius' },
          { binding: 'fahrToCelsius', inspection: 'Not:HasBinding' }
        ]
      },
      expected: {
        exit: 'passed',
        out: /4 passing \(\d+ms\)/
      }
    },
    fail: {
      body: {
        test: [
          'describe("haceFrioF", function() {',
          '  it("212 °F no es frio", function() {',
          '    assert(!haceFrioF(212));',
          '  });',
          '  it("104 °F no es frio", function() {',
          '    assert(haceFrioF(104));',
          '  });',
          '  it("50 °F no es frio", function() {',
          '    assert(!haceFrioF(50));',
          '  });',
          '  it("5 °F es frio", function() {',
          '    assert(!haceFrioF(5));',
          '  });',
          '});'
        ].join('\n'),
        extra: [
          'function fahrToCelsius(temp) {',
          '  return (temp - 32) * 5 / 9;',
          '}'
        ].join('\n'),
        content: [
          'function haceFrioF(temp) {',
          '  return 8 > fahrToCelsius(temp);',
          '}'
        ].join('\n'),
        expectations:[
          { binding: 'haceFrioF', inspection: 'HasBinding' },
          { binding: 'haceFrioF', inspection: 'HasUsage:fahrToCelsius' },
          { binding: 'fahrToCelsius', inspection: 'Not:HasBinding' }
        ]
      },
      expected: {
        exit: 'failed',
        out: /2 passing \(\d+ms\)\s+2 failing/
      }
    }
  }
};
