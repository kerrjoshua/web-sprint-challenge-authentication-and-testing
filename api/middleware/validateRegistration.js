const db = require('../../data/dbConfig')

module.exports = async (req, res, next) => {
    const { username, password } = req.body
    const matchedUsername = !username ?
        null : 
        await db('users').where({ username }).first();
    if (!username || !password) {
        res.status(401).json({ message: 'username and password required' })
    } else if (matchedUsername) {
        res.status(401).json({ message: 'username taken' })
    }
    else {
        req.user = { username, password};
        next()
    }
}