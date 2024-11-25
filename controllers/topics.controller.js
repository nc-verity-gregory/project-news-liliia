const db = require('../db/connection');

function getTopics(req, res, next) {
  db.query('SELECT * FROM topics;')
    .then(({ rows }) => {
      res.status(200).send({ topics: rows });
    })
    .catch(next);
}

module.exports = getTopics;
