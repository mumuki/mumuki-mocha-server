'use strict';

let express = require('express');
let bodyParser = require('body-parser');

let testController = require('./test-controller');

let app = express();

app.post('/test', [
  bodyParser.json({ type: 'application/*' }),
  testController.handle
]);

module.exports = app;
