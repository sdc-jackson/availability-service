var app = require('./index.js');
const supertest = require('supertest');
const request = supertest(app);

test('gets minNightlyRate for a valid stay ID', async done => {
  const response = await request.get('/109/minNightlyRate')

  expect(response.status).toBe(200);
  expect(response.body.minNightlyRate).toBe(426);
  done()
});

test('gets 404 when pinging /minNightlyRate with an invalid stay ID', async done => {
  const response = await request.get('/90/minNightlyRate')

  expect(response.status).toBe(404);
  done()
});

test('gets date availability info array when pinging /availableDates with a valid stay ID', async done => {
  const response = await request.get('/109/availableDates')
  expect(response.body.length).toBeGreaterThanOrEqual(365) //365 days
  expect(response.status).toBe(200);
  done()
});

test('gets 404 when pinging /availableDates with an invalid stay ID', async done => {
  const response = await request.get('/90/availableDates')

  expect(response.status).toBe(404);
  done()
});


