const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

const restrict = require('./middleware/restrict.js');

const authRouter = require('./auth/auth-router.js');
const jokesRouter = require('./jokes/jokes-router.js');

const server = express();

server.use(helmet());
server.use(cors());
server.use(express.json());

server.use('/api/auth', authRouter);
server.use('/api/jokes', restrict, jokesRouter); // only logged-in users should have access!
server.use('/', (req, res, next) => {
    res.json({ api: 'up'})
})
server.use((err, req, res, next) => {
    res.status(err.status || 500).json(
        err.message ? 
        { message: err.message,
        stack: err.stack} :
        { message: "something went wrong with the server"})
})

module.exports = server;
