require('dotenv').config();
const axios = require('axios');
const nano = require('nano')(process.env.COUCHDB);


let start = Date.now();
let total = 10000000;
let batchStart = 1;
let batchSize = 1500;
let wait = 0;
nano.db.destroy('sdc')
  .then(() => nano.db.create('sdc'))
  .then(async () => {
    console.log('sdc database destroyed and created')
    const db = nano.use('sdc')

    while (batchStart < total) {
      let docs = [];
      for (let i = batchStart; i < batchStart + batchSize; i++) {
        let reservations = [];
        let dateCounter = new Date();
        let start = Math.floor(Math.random() * (10 - 1 - 0 + 1) + 0)

        for (let k = 0; k < Math.floor(Math.random() * 30) + 1; k++) {
          let end = start + Math.floor(Math.random() * 9) + 1;
          reservations.push({
            id: k,
            startDate: new Date().setDate(dateCounter.getDate() + start),
            endDate: new Date().setDate(dateCounter.getDate() + end),
          })
          start = Math.floor(Math.random() * (end + k * 15 - 1 - end + 1) + end)
        }
        docs.push({
          productId: i,
          baseRate: Math.floor(Math.random() * 500) + 30,
          weekendMulitplier: Math.floor(Math.random() * (150 - 100) + 100) / 100,
          cleaningFee: Math.floor(Math.random() * 200) + 50,
          serviceFee: Math.floor(Math.random() * 25) + 10,
          occupancyTaxes: Math.floor(Math.random() * 15) + 10,
          reservations
        });
      }
      wait < 3 ? db.bulk({docs}) : await db.bulk({docs});
      wait < 3 ? wait++ : wait = 0;
      console.log('Batch starting with ' + batchStart + ' complete')
      batchStart += batchSize;
    }

    console.log('Seeding Complete')
    console.log(Date.now() - start)
  })
  .catch(err => console.log(err))