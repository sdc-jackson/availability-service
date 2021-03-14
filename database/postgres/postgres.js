const { Sequelize, DataTypes } = require('sequelize');
const { Client } = require('pg');

const db = new Sequelize('test', 'dharmon', null, {
  host: 'localhost',
  port: 5432,
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
  roomId: {
    type: DataTypes.INTEGER,
    references: {
      model: 'Rooms',
      key: 'productId'
    }
  }
},{tableName: 'Reservations'})

Dates.belongsToMany(Room, { through: Reservations })
Room.belongsToMany(Dates, { through: Reservations })

const asyncSeedPostgres = async () => {
  await db.sync({ force: true })
  console.log('All models were synced successfully')
  let start = Date.now();
  let total = 10000000;
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
          roomId: i,
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

}
module.exports = db
module.exports.seed = asyncSeedPostgres