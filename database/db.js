const mongoose = require('mongoose');
const {exampleData} = require('../client/src/exampleData.js');
require('dotenv');

if (process.env.NODE_ENV === 'test') { //for testing and circleCI
  var getMinNightlyRate = (productId, cb) => {
    if(productId < 100 || productId > 199){
      cb(new Error('invalid room id'));
    } else {
      cb(null, {minRate: 426});
    }
  }
  var getAvailableDates = (productId, cb) => {
    if(productId < 100 || productId > 199) {
      cb(new Error('invalid room id'));
    } else {
      cb(null, exampleData);
    }
  }
  var listAllStays = () => {
    cb(null);
  }
}
else {

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
  //CREATE stay
  var createStay = (stayInfo, cb) => {
    const stay = new Stay(stayInfo);
    stay.save((err, doc) => {
      if (err) { cb(err, null); }
      else { cb(null, doc); }
    });
  };
  //CREATE reservation
  var createCalendar = (info, cb) => {
    Stay.find({productId: info.productId}, (err, stay) => {
      if(err) { cb(err, null) }
      if(!stay) { cb(new Error('could not find a stay with that ID'), null) }
      var day = new Calendar({
        stayId: stay._doc._id,
        date: info.date,
        isAvailable: info.isAvailable,
        nightlyRate: info.nightlyRate,
        cleaningFee: info.cleaningFee,
        serviceFee: info.serviceFee,
        occupancyTaxes: info.occupancyTaxes
      });

      day.save((err, d) => {
        if (err) { cb(err, null); }
        else cb(null,'inserted ')
      });
    })
  }
  //READ from stays minNightRate
  var getMinNightlyRate = (productId, cb) => {
    var query = Stay.where({ productId: productId });
    query.findOne( (err, stay) => {
      if (err || stay === null || stay === undefined) {
        //console.log('couldnt find it');
        cb(new Error('could not find a stay with that ID'));
      } else {

        cb(null, stay);
      }
    });
  };
  //UPDATE stay
  var updateStay = (stayObj, cb) => {
    Stay.update({productID: stayObj.productId }, stayObj, (err) => {
      if (err) { cb(err, null) }
      else cb(null, 'success')
    })
  };
  //UPDATE Calender
  var updateCalendar = (lookupObj, updateObj, cb) => {
    Stay.find({productId}), (err, doc) => {
      if (err) { cb(err, null) }
      Calendar.update({ stayId: doc._doc._id, ...lookupObj}, ...updateObj, (err) => {
        if(err) { cb(err, null) }
        else {
          cb(null, 'success')
        }
      })
    }
  }

  //DELETE stay
  var deleteStay = (productId, cb) => {
    Stay.find({productId}, (err, stay) => {
      if(err) { cb(err, null) }
      Calendar.deleteMany({stayId: stay.stayID}, (err) => {
        if(err) { cb(err, null) }
      })
    })
    Stay.deleteOne({ productId }, (err) => {
      if(err) { cb(err, null) }
      else { cb(null, 'success')}
    })
  }

  //DELETE calendar date
  var deleteDates = (id, cb) => {
    Calendar.deleteOne({ id }, (err) => {
      if (err) { return cb(err, null) }
      else cb(null, 'success')
    });
  }

  //READ dates
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
}

module.exports.getMinNightlyRate = getMinNightlyRate;
module.exports.getAvailableDates = getAvailableDates;
module.exports.listAllStays = listAllStays;
module.exports.updateStay = updateStay;
module.exports.createStay = createStay;
module.exports.createCalendar = createCalendar;
module.exports.deleteStay = deleteStay;
module.exports.deleteDates = deleteDates;
module.exports.updateCalendar = updateCalendar;
