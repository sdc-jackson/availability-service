const { Sequelize, DataTypes, Op, QueryTypes } = require('sequelize');
const { Client } = require('pg');
require('dotenv').config()

const db = new Sequelize(process.env.DB_NAME || 'test', process.env.DB_USERNAME || 'dharmon', process.env.DB_PASSWORD || null, {
  host: 'localhost',
  port: process.env.DBPORT || 5432,
  dialect: 'postgres',
  logging: false,
});

const Room = db.define('Room', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  productId: {
    type: DataTypes.INTEGER,
    unique: true
  },
  baseRate: {
    type: DataTypes.INTEGER
  },
  weekendMulitplier: {
    type: DataTypes.FLOAT
  },
  cleaningFee: {
    type: DataTypes.INTEGER
  },
  serviceFee: {
    type: DataTypes.INTEGER
  },
  occupancyTaxes: {
    type: DataTypes.INTEGER
  }
});

const Dates = db.define('Dates', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  date: {
    type: DataTypes.DATEONLY,
  }
}, {
  tableName: 'Dates'
});

const Reservations = db.define('Reservations', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  startDate: {
    type: DataTypes.UUID,
    references: {
      model: 'Dates',
      key: 'id'
    }
  },
  endDate: {
    type: DataTypes.UUID,
    references: {
      model: 'Dates',
      key: 'id'
    }
  },
  productId: {
    type: DataTypes.INTEGER,
    references: {
      model: 'Rooms',
      key: 'productId'
    }
  }
},{
  tableName: 'Reservations',
})


const asyncSeedPostgres = async () => {
  await db.sync({ force: true })
  console.log('All models were synced successfully')
  let start = Date.now();
  let total = 1000000;
  let batchStart = 1;
  let batchSize = 1000;
  let datesIds = [];
  let dateCounter = new Date();
  let wait = 0;

  for (let j = 0; j < 366; j++) {
    dateCounter.setDate(dateCounter.getDate() + 1);
    let dateResponse = await Dates.create({ date: dateCounter })
    datesIds.push(dateResponse.dataValues.id)
  }
  while (batchStart < total) {
    let rooms = [];
    let reservations = [];
    for (let i = batchStart; i < batchStart + batchSize; i++) {
      rooms.push({
        productId: i,
        baseRate: Math.floor(Math.random() * 500) + 30,
        weekendMulitplier: Math.floor(Math.random() * (150 - 100) + 100) / 100,
        cleaningFee: Math.floor(Math.random() * 200) + 50,
        serviceFee: Math.floor(Math.random() * 25) + 10,
        occupancyTaxes: Math.floor(Math.random() * 15) + 10
      })
      let start = Math.floor(Math.random() * (10 - 1 - 0 + 1) + 0)
      for (let k = 0; k < Math.floor(Math.random() * 9) + 1; k++) {
        let end = start + Math.floor(Math.random() * 9) + 1;
        reservations.push({
          productId: i,
          startDate: datesIds[start],
          endDate: datesIds[end],
        })
        start = Math.floor(Math.random() * (end + k * 30 - 1 - end + 1) + end)
      }
    }
    Room.bulkCreate(rooms)
    wait < 100 ? Reservations.bulkCreate(reservations) : await Reservations.bulkCreate(reservations)
    wait < 100 ? wait++ : wait = 0
    console.log('Batch starting with ' + batchStart + ' complete');
    batchStart += batchSize;
  }

  console.log('Seeding Complete')
  console.log(Date.now() - start)
  db.query(`CREATE INDEX "idx_Rooms_productId" ON "Rooms" ("productId")`)
  db.query(`CREATE INDEX "idx_Reservations_productId" ON "Reservations" ("productId")`)
}

const getAvailableDates = (productId) => {

  return new Promise((resolve, reject) => {
    Room.findOne({ where: { productId } })
    .then(async (room) => {
      if (!room) { resolve() }
     const availableDates = await Dates.findAll({
        attributes: ["date"],
        where: {
          date: {
            [Op.notIn]: [
              db.literal(`SELECT DISTINCT "date" as "reservedDates" from "Dates",(select "start"."id","start"."startDate","date" as "endDate" from "Dates" inner join (select "date" as "startDate", "Ressy"."id","Ressy"."productId","Ressy"."endDate" from "Dates" inner join (select * from "Reservations" where "productId" = ${productId}) as "Ressy"on "Ressy"."startDate" = "Dates"."id") as "start" ON "start"."endDate" = "Dates"."id") as "Ressy" where "Dates"."date" BETWEEN "Ressy"."startDate" and "Ressy"."endDate";`)
            ]
          }
        }
      })

      const reservedDates = await db.query(`SELECT DISTINCT "date" as "reservedDates" from "Dates",(select "start"."id","start"."startDate","date" as "endDate" from "Dates" inner join (select "date" as "startDate", "Ressy"."id","Ressy"."productId","Ressy"."endDate" from "Dates" inner join (select * from "Reservations" where "productId" = ${productId}) as "Ressy"on "Ressy"."startDate" = "Dates"."id") as "start" ON "start"."endDate" = "Dates"."id") as "Ressy" where "Dates"."date" BETWEEN "Ressy"."startDate" and "Ressy"."endDate";`, QueryTypes.RAW)
      const availableObj = availableDates.map(availDate => {
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
      const reservedObj = reservedDates[0].map(resDate => {
        const day = new Date(resDate.date).getDay()
        let weekend = false;
        if (day === 5 || day === 6 || day === 0) { weekend = true }
        return {
            occupancyTaxes: room.occupancyTaxes,
            serviceFee: room.serviceFee,
            cleaningFee: room.cleaningFee,
            nightlyRate: weekend ? room.baseRate * room.weekendMulitplier : room.baseRate,
            isAvailable: false,
            date: resDate.date,
            reservationId: resDate.id
        }
      })
      resolve([...availableObj, ...reservedObj])
    })
    .catch(err => reject(err))
  })
}
const createReservation = async ({ productId, startDate, endDate }) => {
  let startId = await Dates.findOne({ where: { date: startDate } }).map(date => date.id)
  let endId = await Dates.findOne({ where: { date: endDate } }).map(date => date.id)
  return Reservations.create({
    roomId: productId,
    startDate: startId,
    endDate: endId
  })
}
const updateReservation = (oldReservation, newReservation) => {
  return Reservations.update(newReservation, { where: { ...oldReservation } })
}
const deleteReservation = ({ reservationId }) => {
  return Reservations.destroy({ where: { id: reservationId } })
}
const getMinNightlyRate = (productId) => {
  return Room.findOne({ where: { productId } })
}
const updateRoom = (productId, updateObj) => {
  return Room.update(updateObj, { where: { productId } })
}


module.exports.seed = asyncSeedPostgres;
module.exports.getAvailableDates = getAvailableDates;
module.exports.getMinNightlyRate = getMinNightlyRate;
module.exports.createReservation = createReservation;
module.exports.updateReservation = updateReservation;
module.exports.deleteReservation = deleteReservation;
module.exports.updateRoom = updateRoom;