const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/airBnB-availability6');
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'airBnB-availability connection error: '));
db.once('open', function() {
  console.log('database is open');
});

const calendarSchema = new mongoose.Schema({
  id: Number,
  stayId: String,
  date: Date,
  isAvailable: Boolean,
  nightlyRate: Number,
  cleaningFee: Number,
  serviceFee: Number,
  occupancyTaxes: Number

});

const Calendar = mongoose.model('Calendar', calendarSchema);

const staySchema = new mongoose.Schema({
  id: Number,
  productId: Number,
  minRate: Number
});

const Stay = mongoose.model('Stay', staySchema);

var getMinNightlyRate = (productId, cb) => {
  var query = Stay.where({productId: productId});
  query.findOne( (err, stay) => {
    if (err || stay === null || stay === undefined) {
      //console.log('couldnt find it');
      cb(new Error('could not find a stay with that ID'));
    } else {

      cb(null, stay);
    }
  });
};

var getAvailableDates = (productId, cb) => {
  Stay.findOne({productId: productId}, (err, stay) => {
    if (err || stay === undefined || stay === null) {
      //console.log(err);
      cb(new Error('Could not find stay in database'));
    } else {
      var stayId = stay._doc._id;

      Calendar.find({stayId: stayId}, null, {sort: 'date'}, (err, dates) => {
        if (err || dates === undefined || dates === null) {
          //console.log(err);
          cb(new Error('Couldnot find dates in database for stay'));

        } else {
          var results = [];
          dates.map((date) => {
            var result = {
              occupancyTaxes: date._doc.occupancyTaxes,
              serviceFee: date._doc.serviceFee,
              cleaningFee: date._doc.cleaningFee,
              nightlyRate: date._doc.nightlyRate,
              isAvailable: date._doc.isAvailable,
              date: date._doc.date,
              stayId: date._doc.stayId,
              id: date._doc._id
            };
            results.push(result);
          });
          cb(null, results);
        }
      });


    }
  });



};

var listAllStays = (cb) => {
  Stay.find({}, (err, stays) => {
    for (var i = 0; i < stays.length; i++) {
      console.log('stay id:', stays[i]._doc._id);
    }
    Calendar.find ({}, (err, dates) => {
      for (var i = 0; i < dates.length; i++) {
        if (i === dates.length - 1) {
          console.log(dates[i]);
        }
        console.log('date id: ', dates[i]._doc._id);
        console.log('stayId: ', dates[i]._doc.stayId);
      }
      cb();
    });
  });

};

module.exports.getMinNightlyRate = getMinNightlyRate;
module.exports.getAvailableDates = getAvailableDates;
module.exports.listAllStays = listAllStays;