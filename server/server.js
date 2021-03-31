require('newrelic');
var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
var path = require('path');
var db = require('../database/postgres/postgres.js')
var expressStaticGzip = require("express-static-gzip");



var app = express();
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(cors());
app.use('/rooms/:id', express.static(__dirname + '/../client/dist'));
app.use(express.static(__dirname + '/../client/dist'));
//app.use('/rooms/:id', expressStaticGzip(__dirname + '/../client/dist/'));

app.get('/rooms/:id/minNightlyRate', (req, res) => {
  db.getMinNightlyRate(req.params.id)
    .then(roomInfo => {
      if(!roomInfo) { res.status(404).send('Product not found') }
      else { res.status(200).send({minNightlyRate: roomInfo.rows[0].baseRate}) }
    })
    .catch(err => res.status(500).send(err.message))
});

app.get('/rooms/:id/availableDates', (req, res) => {
  db.getAvailableDates(req.params.id)
    .then(dates => {
      if(!dates) { res.status(404).send('No product found') }
      else { res.status(200).send(dates) } })
    .catch(err => res.status(500).send(err.message))
});

app.delete('/rooms/:id/reservations', (req, res) => {
  db.deleteReservation(req.body.reservationId)
    .then(success => {
      if (success.rowCount > 0) { res.status(200).send('Deleted')}
      else { res.status(404).send('No changes made')}
    })
    .catch(err => res.status(500).send(err))
});
app.get('/rooms/:id/reservations', (req, res) => {
  db.getReservations(req.params.id)
    .then(response => res.status(200).send(response))
    .catch(err => res.status(500).send(err))
})
app.post('/rooms/:id/reservations', (req, res) => {
  db.createReservation(req.params.id, {
    ...req.body
  })
    .then(response => {
      res.status(200).send({reservationId: response.rows[0].id})
    })
    .catch(err => res.status(500).send(err))
})
app.put('/rooms/:id', (req, res) => {
  db.updateRoom(req.params.id, req.body)
    .then(success => {
      if(success[0] === 0) { res.status(404).send('No changes made') }
      else { res.status(200).send(success) }
    })
    .catch(err => res.status(500).send(err))
})
app.put('/rooms/:id/reservations', (req, res) => {
  db.updateReservation(req.body)
    .then(success => {
      if(success.rowCount> 0) { res.status(200).send('Updated') }
      else { res.status(404).send('No changes made')}
    })
    .catch(err => res.status(500).send(err))
})



module.exports = app;