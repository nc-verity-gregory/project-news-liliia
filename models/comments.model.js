const db = require('../db/connection');

function fetchCommentsByArticleId(article_id) {
  return db.query(
      `SELECT comment_id, votes, created_at, author, body, article_id 
       FROM comments 
       WHERE article_id = $1
       ORDER BY created_at DESC;`,
      [article_id]
    )
    .then(({ rows }) => {
        return rows;
    });
};

function checkArticleExists(article_id) {
  return db.query(
    'SELECT article_id FROM articles WHERE article_id = $1',
    [article_id]
  ).then(({ rows }) => {
    if (rows.length === 0) {
      return Promise.reject({ status: 404, msg: 'Article not found' });
    }
  });
}

function checkUserExists(username) {
  return db.query(
    'SELECT username FROM users WHERE username = $1',
    [username]
  ).then(({ rows }) => {
    if (rows.length === 0) {
      return Promise.reject({ status: 404, msg: 'User not found' });
    }
  });
}

function insertCommentByArticleId(article_id, username, body) {
  return checkArticleExists(article_id)
    .then(() => checkUserExists(username))
    .then(() => {
      return db.query(
        `INSERT INTO comments (article_id, author, body)
        VALUES ($1, $2, $3)
        RETURNING *;
        `,
        [article_id, username, body]
      );
    })
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: 'Article not found' });
      }
      return rows[0];
    });
}

module.exports = { fetchCommentsByArticleId, insertCommentByArticleId };