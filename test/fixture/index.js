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
  }
};
