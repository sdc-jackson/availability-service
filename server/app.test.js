var app = require('./index.js');
const supertest = require('supertest');
const request = supertest(app);

test('gets minNightlyRate', async done => {
  const response = await request.get('/123/minNightlyRate')

  expect(response.status).toBe(200);
  expect(response.body.minNightlyRate).toBe(451);
  done()
});