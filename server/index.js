var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
var path = require('path');
var db = require('../database/postgres/postgres.js')
var expressStaticGzip = require("express-static-gzip");



var app = express();
app.use(cors());
app.use('/rooms/:id', express.static(__dirname + '/../client/dist'));
app.use(express.static(__dirname + '/../client/dist'));
//app.use('/rooms/:id', expressStaticGzip(__dirname + '/../client/dist/'));

app.get('/rooms/:id/minNightlyRate', (req, res) => {
  db.getMinNightlyRate(req.params.id)
    .then(roomInfo => {
      if(!roomInfo.dataValues.baseRate) { res.status(404).send('product not found') }
      else { res.status(200).send({minNightlyRate: roomInfo.baseRate}) }
    })
    .catch(err => res.status(500).send(err.message))
});

app.get('/rooms/:id/availableDates', (req, res) => {
  console.log('hit')
  db.getAvailableDates(req.params.id)
    .then(dates => res.status(200).send(dates))
    .catch(err => res.status(500).send(err))
});


app.delete('/rooms/:id/reservation', (req, res) => {
  const oldRes = {
    productId: req.params.id,
    ...req.body.oldRes
  }
  db.deleteReservation(oldRes)
    .then(success => res.status(200).send(success))
    .catch(err => res.status(500).send(err))
});
app.post('/rooms/:id/reservation', (req, res) => {
  db.createReservation({
    productId: req.params.id,
    ...req.body
  })
})
app.put('/rooms/:id/reservation', (req, res) => {
  const oldRes = {
    productId: req.params.id,
    ...req.body.oldRes
  }
  const newRes = {
    productId: req.params.id,
    ...req.body.newRes
  }
  db.updateReservation(oldRes, newRes)
    .then(success => res.status(200).send(success))
    .catch(err => res.status(500).send(err))
})

console.log('listening on port 5001');
app.listen(5001);

module.exports = app;