const db = require('../../data/dbConfig')
const User = require('../auth/auth-model')

module.exports = async (req, res, next) => {
    const { username, password } = req.body
    if (!username || !password) {
        res.status(401).json({ message: 'username and password required' })
    }
    else {
        const matchedUsername = !username ?
            null :
            await User.findBy({username});
        console.log(matchedUsername)
        if (!matchedUsername) {
            res.status(401).json({ message: 'invalid credentials' })
        }
        else {
            req.user = await User.findBy({username});
            next()
        }
    }
}