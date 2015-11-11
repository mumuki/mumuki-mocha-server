'use strict';

let extensions = require('./extensions');

describe('extensions', () => {

  it('concatMap', () => {
    let concatMap = [{foo: [1,2]}, {foo: [3,4]}].concatMap((obj) => obj.foo);
    concatMap.should.be.eql([1,2,3,4]);
  });

});
