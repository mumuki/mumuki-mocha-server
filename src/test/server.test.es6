'use strict';

var should = require('should');
var supertest = require('supertest');

var fixture = require('./fixture');

var server = supertest(require('../server/server'));

describe('POST /test', () => {

  var assert = (testType, done) => {
    var excecise = fixture.basic[testType];
    server
      .post('/test')
      .send(excecise.body)
      .expect(200, (err, res) => {
        var body = res.body;
        body.exit.should.be.eql(excecise.expected.exit);
        body.out.should.match(excecise.expected.out);
        done(err, res);
      });
  };

  it('should returns 200 when excercise passed', assert.bind(it, 'ok'));
  it('should returns 200 when excercise failed', assert.bind(it, 'fail'));

  var assertExpectation = (testType, done) => {
    var excecise = fixture.withExpectation[testType];
    server
      .post('/test')
      .send(excecise.body)
      .expect(200, (err, res) => {
        var result = res.body;
        result.exit.should.be.eql(excecise.expected.exit);
        result.out.should.match(excecise.expected.out);
        result.expectationResults.should.be.eql([
          { expectation: { binding: 'haceFrioF', inspection: 'HasBinding' }, result: true },
          { expectation: { binding: 'haceFrioF', inspection: 'HasUsage:fahrToCelsius' }, result: true },
          { expectation: { binding: 'fahrToCelsius', inspection: 'Not:HasBinding' }, result: true }
        ]);
        done();
      });
  };

  it('should returns 200 when excercise with expectations passed', assertExpectation.bind(it, 'ok'));
  it('should returns 200 when excercise with expectations failed', assertExpectation.bind(it, 'fail'));

});
