const db = require('../../data/dbConfig')

const bcrypt = require('bcryptjs')

module.exports = {
    findBy,
    addUser
}

async function findBy(param) {
    return await db('users').where(param).first()
}

async function addUser(user) {
    const { username, password } = user;
    
  const hash = bcrypt.hashSync(password, 8)

    const id = await db('users').insert({ username, password: hash})
    return findBy({id})
}