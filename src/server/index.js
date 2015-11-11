'use strict';

let port = process.env.PORT || 8080;
let server = require('./server');

server.listen(port, () => console.log(`Serving on port ${port}`));
