# API Documentation
- Availability service API on port 5001

## Verbs

- GET - used for gathering database information
- POST - used for creating new information
- PUT - used to update existing information
- DELETE - used to remove database information

## Routes

- '/rooms/:id/minNightlyRate'
  - GET
    - Responses
      - 200 { minNightlyRate: 240 }
      - 500 'error message'
- '/rooms/:id/calendar'
  - POST create a new Calendar store {date: Date,
        isAvailable: Boolean,
        nightlyRate: number,
        cleaningFee: Number,
        serviceFee: Number,
        occupancyTaxes: Number}
    - Responses
      - 200 { "_id" : ObjectId("603f09c86748797f5c12e67b"), "stayId" : "603f09c86748797f5c12e579", "date" : ISODate("2021-08-10T03:00:08.348Z"), "isAvailable" : true, "nightlyRate" : 240, "cleaningFee" : 10, "serviceFee" : 2, "occupancyTaxes" : 3, "__v" : 0 }
      - 500 'error message'
  - DELETE remove one date by id { id: GUID }
    - Responses
      - 200 'success'
      - 500 'error message'
  - PUT Update a Calendar input by ID { id: GUID, ...UpdateVariables }
    - Responses
      - 200 - [{ "_id" : ObjectId("603f09c86748797f5c12e67b"), "stayId" : "603f09c86748797f5c12e579", "date" : ISODate("2021-08-10T03:00:08.348Z"), "isAvailable" : true, "nightlyRate" : 240, "cleaningFee" : 10, "serviceFee" : 2, "occupancyTaxes" : 3, "__v" : 0 },...{}]
      - 500 'error message'
- '/rooms/:id/stay'
  - PUT Update a stay { minRate: Number }
    - 200 'success'
    - 500 'error message'
  - DELETE removes stay and all associated calendars
    - Responses
      - 200 'success' (be careful, no authentication required)
      - 500 'error message'
  - POST - Create a new stay { minRate: Number }
      -200 {
            id: Number,
            productId: Number,
            minRate: Number
          }
      - 500 'error message'
