const db = require('../db/connection');

function fetchAllUsers() {
  return db.query(`
    SELECT username, name, avatar_url
    FROM users;
  `).then(({ rows }) => {
    return rows; 
  });
}

module.exports = fetchAllUsers;