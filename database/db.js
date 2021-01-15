const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/airBnB-availability');
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'airBnB-availability connection error: '));
db.once('open', function() {
  console.log('database is open');
})

const calendarSchema = new mongoose.Schema({
  id: Number,
  stayId: Number,
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
    if(err) {
      console.log('couldnt find it');
    } else {

      cb(stay);
    }
  });
}

module.exports.getMinNightlyRate = getMinNightlyRate;