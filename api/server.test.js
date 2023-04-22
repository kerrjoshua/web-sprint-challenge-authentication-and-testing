// Write your tests here

const request = require('supertest')
const db = require("../data/dbConfig")
const server = require('./server')

const joke1 = { joke: "Why did the chicken cross the road? It didn't"}
const joke2 = { joke: "bar"}

beforeAll(async () => {
  await db.migrate.rollback()
  await db.migrate.latest()
})

beforeEach(async () => {
  await db('users').truncate()
})

afterAll(async () => {
  await db.destroy()
})

test('sanity', () => {
  expect(true).toBe(false)
})

describe('server.js', () => {
  describe('index route', () => {
    it('[1] should return an OK status code from the index route', async () => {
      const expectedStatusCode = 200;
      const response = await request(server).get('/');

      expect(response.status).toEqual(expectedStatusCode)
    })
    
  })
})

describe('GET /api/jokes', () => {
  describe('jokes route', () => {
    it('[2] returns proper response to missing auth token', async () => {
      const expectedMessage = "token required";
      const response = await request(server).get('/api/jokes');

      expect(response.body.message).toBe(expectedMessage)
    })
    it('[3] returns proper response to invalid token', async () => {
      const expectedMessage = "invalid token";
      const response = (await request(server)
        .get('/api/jokes')
        .set('Authorization', 'none')
        
        );

      expect(response.body.message).toBe(expectedMessage)
    })
    
  })
})