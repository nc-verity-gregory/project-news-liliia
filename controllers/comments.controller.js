const { 
  fetchCommentsByArticleId,
  insertCommentByArticleId
 } = require('../models/comments.model');


function getCommentsByArticleId(req, res, next) {
  const { article_id } = req.params;

  fetchCommentsByArticleId(article_id)
    .then((comments) => {
      res.status(200).send({ comments });
    })
    .catch(next);
}

function postCommentByArticleId(req, res, next) {
  const { article_id } = req.params;
  const { username, body } = req.body;

  if (!username || !body) {
      res.status(400).send({ msg: 'Bad request: missing username or body' });
      return;
  }

  insertCommentByArticleId(article_id, username, body)
      .then((comment) => {
          res.status(201).send({ comment });
      })
      .catch(next);
}

module.exports = { getCommentsByArticleId, postCommentByArticleId };
