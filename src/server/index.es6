'use strict';

var port = process.env.PORT || 8080;
var server = require('./server');

server.listen(port, function () {
  console.log('Serving on port ' + port);
});
