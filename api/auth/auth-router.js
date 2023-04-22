const router = require('express').Router();
const db = require('../../data/dbConfig')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const validateLogin = require('../middleware/validateLogin');
const validateRegistration = require('../middleware/validateRegistration');
const { JWT_SECRET } = require('../secrets');

router.post('/register', validateRegistration, async (req, res, next) => {
  const { username, password } = req;
  const hash = bcrypt.hashSync(password, 8)
  const [id] = await db('users').insert({ username, password: hash })
  const newUser = await db('users').where({ id }).first()
  res.status(201).json(newUser);


  /*
    IMPLEMENT
    You are welcome to build additional middlewares to help with the endpoint's functionality.
    DO NOT EXCEED 2^8 ROUNDS OF HASHING!

    1- In order to register a new account the client must provide `username` and `password`:
      {
        "username": "Captain Marvel", // must not exist already in the `users` table
        "password": "foobar"          // needs to be hashed before it's saved
      }

    2- On SUCCESSFUL registration,
      the response body should have `id`, `username` and `password`:
      {
        "id": 1,
        "username": "Captain Marvel",
        "password": "2a$08$jG.wIGR2S4hxuyWNcBf9MuoC4y0dNy7qC/LbmtuFBSdIhWks2LhpG"
      }

    3- On FAILED registration due to `username` or `password` missing from the request body,
      the response body should include a string exactly as follows: "username and password required".

    4- On FAILED registration due to the `username` being taken,
      the response body should include a string exactly as follows: "username taken".
  */
});

router.post('/login', validateLogin, (req, res, next) => {

  function generateToken(user) {
    const payload = {
      subject: user.id,
      username: user.username
    };

    const options = {
      expiresIn: '10m',
    };

    return jwt.sign(payload, JWT_SECRET, options);
  }

  const username = req.user.username

  if (bcrypt.compareSync(req.body.password, req.user.password)) {
    const token = generateToken(req.user)
    res.json({
      message: `welcome, ${username}`,
      token: token
    })
  } else { 
    res.status(401).json({ message: 'invalid credentials' })
  }

  
  /*
    IMPLEMENT
    You are welcome to build additional middlewares to help with the endpoint's functionality.

    1- In order to log into an existing account the client must provide `username` and `password`:
      {
        "username": "Captain Marvel",
        "password": "foobar"
      }

    2- On SUCCESSFUL login,
      the response body should have `message` and `token`:
      {
        "message": "welcome, Captain Marvel",
        "token": "eyJhbGciOiJIUzI ... ETC ... vUPjZYDSa46Nwz8"
      }

    3- On FAILED login due to `username` or `password` missing from the request body,
      the response body should include a string exactly as follows: "username and password required".

    4- On FAILED login due to `username` not existing in the db, or `password` being incorrect,
      the response body should include a string exactly as follows: "invalid credentials".
  */
});

module.exports = router;
