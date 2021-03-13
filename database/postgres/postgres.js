const { Sequelize, DataTypes } = require('sequelize');
const { Client } = require('pg');

const db = new Sequelize('dharmon', 'dharmon', null, {
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
  minRate: {
    type: DataTypes.INTEGER
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
    type: DataTypes.DATEONLY
  }
}, {
  tableName: 'Dates'
});

const Reservation = db.define('Reservation', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  dateId: {
    type: DataTypes.UUID,
    references: {
      model: 'Dates',
      key: 'id'
    }
  },
  roomId: {
    type: DataTypes.UUID,
    references: {
      model: 'Rooms',
      key: 'productId'
    }
  },
  cost: {
    type: DataTypes.INTEGER
  }
})

Dates.belongsToMany(Room, { through: Reservations })
Room.belongsToMany(Dates, { through: Reservations })

const asyncSeedPostgres = async () => {
  await db.sync({force: true})
  console.log('All models were synced successfully')
  let start = Date.now();
  let total = 100;
  let batchStart = 1;
  let batchSize = 100;
  let dateCounter = new Date()
  let dates = [];
  for (let j = 0; j < 365; j++) {
    dateCounter.setDate(dateCounter.getDate() + 1)
    dates.push({
      date: dateCounter
    })
  }
  let datesIds = await Dates.bulkCreate(dates)
  console.log(datesIds)
  // let wait = true;
  // while (batchStart < total) {
  //   let rooms = [];
  //   let rooms_dates = [];
  //   for (let i = batchStart; i < batchStart + batchSize; i++) {
  //     rooms.push({
  //       productId: i,
  //       baseRate = Math.floor(Math.random() * 500) + 30,
  //       weekendMulitplier: Math.floor(Math.random() * (150 - 100) + 100)/100,
  //       cleaningFee: Math.floor(Math.random() * 200) + 50,
  //       serviceFee: Math.floor(Math.random() * 25) + 10,
  //       occupancyTaxes: Math.floor(Math.random() * 15) + 10
  //     })
  //     for (let k = 1; k < 366; k++) {
  //       rooms_dates.push({
  //         roomId: i,
  //         dateId: k,
  //         isAvailable: Math.floor(Math.random() * 4) === 1 ? false : true,
  //         rate: minRate * Math.floor(Math.random() * 100) / 100 + 1
  //       })
  //     }

  //   }
  //   Room.bulkCreate(rooms)
  //   wait  ? await Rooms_Dates.bulkCreate(rooms_dates) : Rooms_Dates.bulkCreate(rooms_dates);
  //   wait = !wait
  // console.log('Batch starting with '+ batchStart + ' complete');
  // batchStart += batchSize;
  // }

  console.log('Seeding Complete')
  console.log(Date.now()- start)
}
module.exports = db
module.exports.seed = asyncSeedPostgres