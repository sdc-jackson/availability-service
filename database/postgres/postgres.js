require('dotenv').config()
const { Sequelize, DataTypes, Op, QueryTypes } = require('sequelize');
const { Client,Pool } = require('pg');
const fs = require('fs')
const path = require('path')
const { v4: uuidv4 } = require('uuid')

const client = new Client();
const pool = new Pool();




const asyncSeedPostgres = async () => {
  function formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2)
        month = '0' + month;
    if (day.length < 2)
        day = '0' + day;

    return [year, month, day].join('-');
  }


//initialize variables
  let start = Date.now();
  let total = 10000000;
  let batchStart = 1;
  let batchSize = 100000;
  let datesIds = [];
  let dateCounter = new Date();
  let roomOutput = './roomOutput.csv';
  let reservationOutput = './reservationOutput.csv';
  //wait for connection
  await client.connect()


  //load tables
  await client.query(`DROP TABLE IF EXISTS "Dates" CASCADE`)
  await client.query(`DROP TABLE IF EXISTS "Reservations" CASCADE`)
  await client.query(`DROP TABLE IF EXISTS "Rooms" CASCADE`)
  await client.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`)
  await client.query(`CREATE TABLE "Dates" (
    id uuid DEFAULT uuid_generate_v4(),
    date DATE
   );`)
  await client.query(`CREATE TABLE "Rooms" (
    id uuid DEFAULT uuid_generate_v4(),
    "productId" INTEGER NOT NULL,
    "baseRate" INTEGER NOT NULL,
    "weekendMultiplier" DECIMAL NOT NULL,
    "cleaningFee" INTEGER NOT NULL,
    "serviceFee" INTEGER NOT NULL,
    "occupancyTaxes" INTEGER NOT NULL
   );`)
   await client.query(`CREATE TABLE "Reservations" (
    id uuid DEFAULT uuid_generate_v4(),
    "startDate" uuid NOT NULL,
    "endDate" uuid NOT NULL,
    "productId" INTEGER NOT NULL
   );`)
    console.log('Tables Created')
  //Add to dates table
  for (let j = 0; j < 366; j++) {
    dateCounter.setDate(dateCounter.getDate() + 1);
    datesIds.push(uuidv4());
    await client.query(`INSERT INTO "Dates" (id, date) VALUES ('${datesIds[j]}', '${formatDate(dateCounter)}')`)
  }
  console.log('dates created')
  //start batching
  while (batchStart < total) {
    let batchStartTime = Date.now()
    let rooms = [];
    let reservations = [];
    let streamRoom = fs.createWriteStream(roomOutput);
    let streamReservation = fs.createWriteStream(reservationOutput)
    //write headers to csv files
    streamRoom.write(`id, productId,baseRate,weekendMultiplier,cleaningFee,serviceFee,occupancyTaxes\n`)
    streamReservation.write(`id,startDate,endDate,productId\n`)
    //create data
    for (let i = batchStart; i < batchStart + batchSize; i++) {
      streamRoom.write(`${uuidv4()},${i},${Math.floor(Math.random() * 500) + 30},${Math.floor(Math.random() * (150 - 100) + 100) / 100},${Math.floor(Math.random() * 200) + 50},${Math.floor(Math.random() * 25) + 10},${Math.floor(Math.random() * 15) + 10}\n`,'utf-8')

      let start = Math.floor(Math.random() * (10 - 1 - 0 + 1) + 0)
      //make between 1 and 9 reservations
      for (let k = 0; k < Math.floor(Math.random() * 9) + 1; k++) {
        //end the reservation between one and 10 days later
        let end = start + Math.floor(Math.random() * 9) + 1;
        //write the current reservation to the file
        await streamReservation.write(`${uuidv4()},${datesIds[start]},${datesIds[end]},${i}\n`)
        //make a new reservation between one and 10 days later
        start = end + Math.floor(Math.random()* 9) + 1
      }
    }
    //wait for the files to close
    streamRoom.end()
    streamReservation.end()
    await new Promise ((resolve, reject) => {
      streamRoom.on('close', () => {
        resolve()
      })
    })
    await new Promise ((resolve, reject) => {
      streamReservation.on('close', () => {
        resolve()
      })
    })

    //copy from the csv files
    await client
      .query(`COPY "Rooms" from '${path.resolve('roomOutput.csv')}' CSV HEADER;`)
      .then(res => console.log('Rooms inserted'))
      .catch(err => console.log(err))
    await client
      .query(`COPY "Reservations" from '${path.resolve('reservationOutput.csv')}' CSV HEADER;`)
      .then(res => console.log('reservations inserted'))
      .catch(err => console.log(err))
    console.log(`Batch starting with ${batchStart} complete, ${batchSize} records inserted. Elapsed time: ${Date.now()-batchStartTime}`);
    batchStart += batchSize;
  }
  //delete the files
  fs.unlink('reservationOutput.csv',(err) => {
    if(err) { console.log(err) }
    else { console.log('reservationOutput.csv deleted')}
  })
  fs.unlink('roomOutput.csv',(err) => {
    if(err) { console.log(err) }
    else { console.log('roomOutput.csv deleted')}
  })
  //add all the indexes and foreign keys
  console.log('Seeding Complete...Adding Indexes and Foreign Keys')
  await client.query(`ALTER TABLE "Dates" ADD CONSTRAINT dates_pkey PRIMARY KEY (id);`)
  await client.query(`ALTER TABLE "Rooms" ADD CONSTRAINT rooms_pkey PRIMARY KEY (id);`)
  await client.query(`ALTER TABLE "Reservations" ADD CONSTRAINT reservations_pkey PRIMARY KEY (id);`)
  await client.query(`ALTER TABLE "Rooms" ADD CONSTRAINT rooms_unique_productid UNIQUE ("productId");`)
  await client.query(`ALTER TABLE "Reservations" ADD CONSTRAINT "fk_endDate" FOREIGN KEY ("endDate") REFERENCES "Dates" ("id")`)
  await client.query(`ALTER TABLE "Reservations" ADD CONSTRAINT "fk_startDate" FOREIGN KEY ("startDate") REFERENCES "Dates" ("id")`)
  await client.query(`ALTER TABLE "Reservations" ADD CONSTRAINT "fk_productId" FOREIGN KEY ("productId") REFERENCES "Rooms" ("productId")`)
  await client.query(`CREATE INDEX "idx_reservations_productId" ON "Reservations" ("productId")`)
  client.end()
  //TIME
  console.log(Date.now() - start)
}

const getAvailableDates = async (productId) => {
  let room = await pool.query(`SELECT * FROM "Rooms" WHERE "productId" = ${productId}`);
  room = room.rows[0]
  if (room === undefined) { return }
  const reservedDates = await pool.query(`SELECT DISTINCT "date" as "reservedDates" from "Dates",(select "start"."id","start"."startDate","date" as "endDate" from "Dates" inner join (select "date" as "startDate", "Ressy"."id","Ressy"."productId","Ressy"."endDate" from "Dates" inner join (select * from "Reservations" where "productId" = ${productId}) as "Ressy"on "Ressy"."startDate" = "Dates"."id") as "start" ON "start"."endDate" = "Dates"."id") as "Ressy" where "Dates"."date" BETWEEN "Ressy"."startDate" and "Ressy"."endDate";`);
  // console.log(reservedDates)
  const availableDates = await pool.query(`select "date" from "Dates" WHERE "date" NOT IN (SELECT DISTINCT "date" as "reservedDates" from "Dates",(select "start"."id","start"."startDate","date" as "endDate" from "Dates" inner join (select "date" as "startDate", "Ressy"."id","Ressy"."productId","Ressy"."endDate" from "Dates" inner join (select * from "Reservations" where "productId" = ${productId}) as "Ressy"on "Ressy"."startDate" = "Dates"."id") as "start" ON "start"."endDate" = "Dates"."id") as "Ressy" where "Dates"."date" BETWEEN "Ressy"."startDate" and "Ressy"."endDate")`)
  const availableObj = availableDates.rows.map(availDate => {
    const day = new Date(availDate.date).getDay()
    let weekend = false;
    if (day === 5 || day === 6 || day === 0) { const weekend = true }
    return {
      occupancyTaxes: room.occupancyTaxes,
      serviceFee: room.serviceFee,
      cleaningFee: room.cleaningFee,
      nightlyRate: weekend ? room.baseRate * room.weekendMulitplier : room.baseRate,
      isAvailable: true,
      date: availDate.date
    }
  })
  const reservedObj = reservedDates.rows.map(resDate => {
    const day = new Date(resDate.reservedDates).getDay()
    let weekend = false;
    if (day === 5 || day === 6 || day === 0) { weekend = true }
    return {
        occupancyTaxes: room.occupancyTaxes,
        serviceFee: room.serviceFee,
        cleaningFee: room.cleaningFee,
        nightlyRate: weekend ? room.baseRate * room.weekendMulitplier : room.baseRate,
        isAvailable: false,
        date: resDate.reservedDates,
        stayId: resDate.id
    }
  })
  return [...availableObj, ...reservedObj].sort((a,b) => {
          const c = new Date(a.date)
          const d =  new Date(b.date)
          return c-d;
        })
}
const createReservation = async (productId, {startDate, endDate }) => {
  let startId = await pool.query(`SELECT "id" from "Dates" where "date" = '${startDate}'`)
  let endId = await pool.query(`SELECT "id" from "Dates" where "date" = '${endDate}'`)
  return pool.query(`INSERT INTO "Reservations" ("startDate", "endDate", "productId") VALUES ('${startId.rows[0].id}', '${endId.rows[0].id}', '${productId}') RETURNING id`)
}
const getReservations = (productId) => {
  return pool.query(`SELECT DISTINCT "date" as "reservedDates", "Ressy"."id" as "reservationId" from "Dates",(select "start"."id","start"."startDate","date" as "endDate" from "Dates" inner join (select "date" as "startDate", "Ressy"."id","Ressy"."productId","Ressy"."endDate" from "Dates" inner join (select * from "Reservations" where "productId" = ${productId}) as "Ressy"on "Ressy"."startDate" = "Dates"."id") as "start" ON "start"."endDate" = "Dates"."id") as "Ressy" where "Dates"."date" BETWEEN "Ressy"."startDate" and "Ressy"."endDate";`)
}
const updateReservation = async ({reservationId, startDate, endDate}) => {
  let startId = await pool.query(`SELECT "id" from "Dates" where "date" = '${startDate}'`)
  let endId = await pool.query(`SELECT "id" from "Dates" where "date" = '${endDate}'`)
  return pool.query(`UPDATE "Reservations" SET "startDate" = '${startId.rows[0].id}', "endDate" = '${endId.rows[0].id}' WHERE id = '${reservationId}'`)
}
const deleteReservation = (reservationId) => {
  return pool.query(`DELETE FROM "Reservations" where "id" = '${reservationId}'`)
}
const getMinNightlyRate = (productId) => {
  return pool.query(`SELECT * from "Rooms" where "productId" = ${productId}`)
}
const updateRoom = (productId, updateObj) => {

}


module.exports.seed = asyncSeedPostgres;
module.exports.getAvailableDates = getAvailableDates;
module.exports.getMinNightlyRate = getMinNightlyRate;
module.exports.createReservation = createReservation;
module.exports.updateReservation = updateReservation;
module.exports.deleteReservation = deleteReservation;
module.exports.updateRoom = updateRoom;
module.exports.getReservations = getReservations;