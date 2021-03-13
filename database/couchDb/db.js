require('dotenv').config();
const axios = require('axios');
const nano = require('nano')(process.env.COUCHDB);


let start = Date.now();
let total = 100000;
let batchStart = 1;
let batchSize = 3000;
let wait = 0;
nano.db.destroy('sdc')
  .then(() => nano.db.create('sdc'))
  .then(async () => {
    console.log('sdc database destroyed and created')
    const db = nano.use('sdc')

    while (batchStart < total) {
      let docs = [];
      for (let i = batchStart; i < batchStart + batchSize; i++) {
        let minRate = Math.floor(Math.random() * 500) + 30;
        let dateCounter = new Date();
        let dates = [];

        for (let k = 1; k < 366; k++) {
          dateCounter.setDate(dateCounter.getDate() + 1);
          dates.push({
            date: dateCounter,
            isAvailable: Math.floor(Math.random() * 4) === 1 ? false : true,
            rate: minRate * Math.floor(Math.random() * 100) / 100 + 1
          });
        }
        docs.push({
          productId: i,
          minRate: Math.floor(Math.random() * 500) + 30,
          cleaningFee: Math.floor(Math.random() * 200) + 50,
          serviceFee: Math.floor(Math.random() * 25) + 10,
          occupancyTaxes: Math.floor(Math.random() * 15) + 10,
          dates
        });
      }


      await axios.post('http://admin:admin@127.0.0.1:5984/sdc/_bulk_docs?batch=ok',
        { docs }
      ).then(res => console.log(res.data))
      .catch(err=>console.log(err))
      // wait > 10 ? wait = 0 :  wait++
      console.log('Batch starting with ' + batchStart + ' complete')
      batchStart += batchSize;
    }

    console.log('Seeding Complete')
    console.log(Date.now() - start)
  })
  .catch(err => console.log(err))