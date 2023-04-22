/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('users').truncate()
  await knex('users').insert([
    {id: 1, username: 'foo', password: 'bar'},
    {id: 2, username: 'fizz', password: 'buzz'}
  ]);
};
