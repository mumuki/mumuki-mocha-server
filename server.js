var express = require('express')
var app = express()

app.post('/test/:name', function (req, res) {
  res.send('Do you want me!'+req.params.name);
})

var server = app.listen(3000, function () {


})