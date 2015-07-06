'use strict';

var extensions = require('./extensions');

describe('extensions', function () {

  it('concatMap', function () {
    var concatMap = [{foo: [1,2]}, {foo: [3,4]}].concatMap(function (obj) { return obj.foo; });
    concatMap.should.be.eql([1,2,3,4]);
  });

});
