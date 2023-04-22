const db = require('../../data/dbConfig')

module.exports = {
    findBy,
    // addUser
}

async function findBy(param) {
    return await db('users').where(param).first()
}