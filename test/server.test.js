'use strict';

var should = require('should');
var supertest = require('supertest');

var fixture = require('./fixture');

var server = supertest(require('../server/server'));

describe('POST /test', function () {

  var assert = function (testType, done) {
    var excecise = fixture.basic[testType];
    server
      .post('/test')
      .send(excecise.body)
      .expect(200, function (err, res) {
        var body = JSON.parse(res.text);
        body.exit.should.be.eql(excecise.expected.exit);
        body.out.should.match(excecise.expected.out);
        done(err, res);
      });
  };

  it('should returns 200 when excercise passed', assert.bind(it, 'ok'));
  it('should returns 200 when excercise failed', assert.bind(it, 'fail'));

});
