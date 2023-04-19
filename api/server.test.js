// Write your tests here

const request = require('supertest')
const server = require('./server')

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