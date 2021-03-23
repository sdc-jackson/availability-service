const { Sequelize, DataTypes, Op, QueryTypes } = require('sequelize');
const { Client } = require('pg');

const db = new Sequelize(process.env.DB_NAME || 'changeMyName', process.env.DB_USERNAME || 'dharmon', process.env.DB_PASSWORD || null, {
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
},{
  indexes: [{
    name: 'idx_Rooms_ProductId',
    fields: ['productId']
  }]
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
    type: DataTypes.DATEONLY,

  },
  endDate: {
    type: DataTypes.DATEONLY,

  },
  productId: {
    type: DataTypes.INTEGER,
  }
},{
  tableName: 'Reservations',
  indexes: [{
    name: 'idx_Reservations_ProductId',
    fields: ['productId']
  }]
})

Reservations.hasMany(Room)
Room.belongsTo(Reservations)

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
      let dateRef = new Date()
      for (let k = 0; k < Math.floor(Math.random() * 9) + 1; k++) {
        let end = start + Math.floor(Math.random() * 9) + 1;
        reservations.push({
          roomId: i,
          startDate: new Date().setDate(dateRef.getDate() + start),
          endDate: new Date().setDate(dateRef.getDate() + end),
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
}

const getAvailableDates = (productId) => {
  return Dates.findAll({
    where: {
      date: {
        [Op.notIn]: [
          sequelize.literal(`SELECT DISTINCT "date" from "Dates",(select "startDate", "endDate" from "Reservations" where "productId" = ${productId}) as "Ressy" WHERE "Dates"."date" BETWEEN "Ressy"."startDate" AND "Ressy"."endDate";`)
        ]
      }
    }
  })
}
const createReservation = ({ productID, startDate, endDate }) => {
  return Reservations.create({
    roomId: productId,
    startDate,
    endDate
  })
}
const updateReservation = (oldReservation, newReservation) => {
  return Reservations.update(newRes, { where: oldRes })
}
const deleteReservation = (ReservationDetails) => {
  return Reservations.destroy({ where: ReservationDetails })
}
const getMinNightlyRate = (productId) => {
  return Rooms.findOne({where: { productId }})
}

module.exports = db;
module.exports.seed = asyncSeedPostgres;
module.exports.getAvailableDates = getAvailableDates;
module.exports.getMinNightlyRate = getMinNightlyRate;
module.exports.createReservation = createReservation;
module.exports.updateReservation = updateReservation;
module.exports.deleteReservation = deleteReservation;