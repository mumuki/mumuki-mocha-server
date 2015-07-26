'use strict';

let port = process.env.PORT || 8080;
let server = require('./server');

server.listen(port, function () {
  console.log('Serving on port ' + port);
});
