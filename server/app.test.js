var app = require('./server.js');
const supertest = require('supertest');
const request = supertest(app);

test('gets minNightlyRate for a valid stay ID', async done => {
  const response = await request.get('/rooms/2/minNightlyRate')

  expect(response.status).toBe(200);
  expect(response.body.minNightlyRate).toBe(360);
  done()
});

test('gets 404 when pinging /minNightlyRate with an invalid stay ID', async done => {
  const response = await request.get('/rooms/0/minNightlyRate')

  expect(response.status).toBe(404);
  done()
});

test('gets date availability info array when pinging /availableDates with a valid stay ID', async done => {
  const response = await request.get('/rooms/109/availableDates')
  expect(response.body.length).toBeGreaterThanOrEqual(365) //365 days
  expect(response.status).toBe(200);
  done()
});

test('gets 404 when pinging /availableDates with an invalid stay ID', async done => {
  const response = await request.get('/rooms/0/availableDates')

  expect(response.status).toBe(404);
  done()
});


