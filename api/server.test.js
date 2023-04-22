// Write your tests here

const request = require('supertest')
const db = require("../data/dbConfig")
const server = require('./server')
const bcrypt = require('bcryptjs')
const User = require('./auth/auth-model')

const joke1 = { joke: "Why did the chicken cross the road? It didn't" }
const joke2 = { joke: "bar" }

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
  expect(0).toBeFalsy
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

describe('/auth', () => {
  describe('POST /login', () => {
  
    const user = { username: 'foo', password: 'bar' } 

    it('[2] should respond with a message and a token', async () => {
     const addedUser = await User.addUser(user)
      const response = await request(server).post('/api/auth/login').send(user)
      expect(response.body)
        .toMatchObject(
          expect.objectContaining({
            message: "welcome, foo",
            token: expect.any(String)
          })
        )
    })
    it('[3] should throw proper error for incomplete credentials', async () => {
      const response1 =
        await request(server)
          .post('/api/auth/login')
          .send({ username: 'foo' })
 
      const response2 =
        await request(server)
          .post('/api/auth/login')
          .send({ password: '1234' }) 


      expect(response1.body.message)
        .toBe('username and password required')
      expect(response2.body.message)
        .toBe('username and password required')
    })

    it('[4] should throw proper error for invalid credentials', async () => {
      const user1 = { username: "Joshua", password: "1234" }
      const response1 = await request(server)
        .post('/api/auth/login')
        .send(user1)

      expect(response1.body.message)
        .toBe('invalid credentials')
    })
  })
})

describe('GET /api/jokes', () => {
  describe('jokes route', () => {
    it('[5] returns proper response to missing auth token', async () => {
      const expectedMessage = "token required";
      const response = await request(server).get('/api/jokes');

      expect(response.body.message).toBe(expectedMessage)
    })
    it('[6] returns proper response to invalid token', async () => {
      const expectedMessage = "invalid token";
      const response = (await request(server)
        .get('/api/jokes')
        .set('Authorization', 'none')

      );

      expect(response.body.message).toBe(expectedMessage)
    })

  })
})