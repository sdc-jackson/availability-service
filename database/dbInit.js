const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/airBnB-availability6');
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'airBnB-availability connection error: '));
db.once('open', function() {
  console.log('database is open');
})

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

//Create Stays and Calendars for each stay
for(var stayId = 0; stayId < 100; stayId++) {
  var productId = stayId + 100; //100 to 199
  var minRate = Math.floor(Math.random() * 500) + 30; //Result between $30 and $530
  var thisStay = new Stay({productId: stayId + 100, minRate: minRate});
  var thisStayId;
  thisStay.save( (err, q) => {
    if(err) return console.log(err);
    else {
      thisStayId = q._doc._id;
      var weekendRate = Math.floor(Math.random() * 20) + q._doc.minRate;
      //also want to create calendar dates for each stay
      var date = new Date();
      for(var dayCount = 0; dayCount < 365; dayCount++) {
        date.setDate(date.getDate() + 1);
        var thisDate = new Date(date);

        var isAvailable = Math.floor(Math.random() * 4) === 1 ? false : true;

        if([4, 5, 6].includes(thisDate.getDay())) {
          var nightlyRate = weekendRate;

        } else {
          var nightlyRate = q._doc.minRate;
        }
        var cleaningFee = 10;
        var serviceFee = 2;
        var occupancyTaxes = 3;

        console.log(thisStayId);
        var day = new Calendar({
          stayId: thisStayId,
          date: thisDate,
          isAvailable: isAvailable,
          nightlyRate: nightlyRate,
          cleaningFee: cleaningFee,
          serviceFee: serviceFee,
          occupancyTaxes: occupancyTaxes
        })

        day.save((err, d) => {
          if(err) console.log(err);
        })

      }
    }
  })
}



