var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
var path = require('path');
var db = require('../database/db.js');


var app = express();
app.use('/rooms/:id', express.static(__dirname + '/../client/dist'));

app.get('/rooms/:id/minNightlyRate', (req, res) => {

  db.getMinNightlyRate(req.params.id, (err, rate) => {
    if (err) {
      //console.log(err);
      res.sendStatus(404);
    } else {
      res.status(200);
      res.send({minNightlyRate: rate.minRate});
      res.end();
    }
  });
});

app.get('/rooms/:id/availableDates', (req, res) => {

  db.getAvailableDates(req.params.id, (err, dates) => {
    if (err) {
      res.sendStatus(404);
    } else {
      res.status(200);
      res.send(dates);
      res.end;
    }
  });
});



console.log('listening on port 5001');
app.listen(5001);

module.exports = app;