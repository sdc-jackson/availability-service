var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
var path = require('path');
var db = require('../database/db.js');


var app = express();
app.use(express.static(__dirname + '/../client/dist'));

app.get('/:id/minNightlyRate', (req, res) => {

  db.getMinNightlyRate(req.params.id, (rate) => {
    res.status(200);
    res.send({minNightlyRate: rate.minRate});
    res.end();
  });
});



console.log('listening on port 5001');
app.listen(5001);

module.exports = app;