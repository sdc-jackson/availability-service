var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
var path = require('path');
var db = require('../database/db.js');
var expressStaticGzip = require("express-static-gzip");



var app = express();
app.use(cors());
app.use('/rooms/:id', express.static(__dirname + '/../client/dist'));
app.use(express.static(__dirname + '/../client/dist'));
//app.use('/rooms/:id', expressStaticGzip(__dirname + '/../client/dist/'));

app.get('/rooms/:id/minNightlyRate', (req, res) => {
  db.getMinNightlyRate(req.params.id, (err, rate) => {
    if (err) {
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

app.post('/rooms/:id', (req, res) => {
  db.createStay({ productId: req.params.id, ...req.body }, (err, message) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(200).send(message);
    }
  });
});
app.delete('/rooms/:id/stay', (req, res) => {
  db.deleteStay(req.params.id, (err, message) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(200).send(message);
    }
});
app.put('/rooms/:id/stay', (req, res) => {
  db.updateStay({ productId: req.params.id, ...req.body }, (err, message) => {
    if (err) { res.status(500).send(err) }
    else { res.status(200).send(message) }
  })
})
app.put('/rooms/:id/calendar', (req, res) => {
  db.updateCalendar({ productId: req.params.id, ...req.body }, (err, message) => {
    if (err) { res.status(500).send(err) }
    else { res.status(200).send(message) }
  })
})
app.delete('/rooms/:id/calendar', (req, res) => {
  db.deleteDates({ id: req.body.id }, (err, message) => {
    if (err) { res.status(500).send(err) }
    else { res.status(200).send(message) }
  })
})
app.post('/rooms/:id/calendar', (req, res) => {
  db.createCalendar({ productId: req.params.id, ...req.body }, (err, doc) => {
    if (err) { res.status(500).send(err) }
    else {
      res.status(200).send(doc)
    }
  })
})


})


console.log('listening on port 5001');
app.listen(5001);

module.exports = app;