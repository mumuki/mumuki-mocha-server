'use strict';

var express = require('express');
var bodyParser = require('body-parser');

var testController = require('./test-controller');

var app = express();

app.post('/test', [
  bodyParser.json({ type: 'application/*' }),
  testController.handle
]);

module.exports = app;
