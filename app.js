const express = require('express');
const app = express();
const getApi = require("./controllers/api.controller");
const getTopics = require('./controllers/topics.controller');
const { getArticleById, getArticles } = require('./controllers/articles.controller');
const { getCommentsByArticleId, postCommentByArticleId } = require('./controllers/comments.controller');

app.use(express.json());


app.get('/api', getApi);
app.get('/api/topics', getTopics);
app.get('/api/articles', getArticles);
app.get('/api/articles/:article_id', getArticleById);
app.get('/api/articles/:article_id/comments', getCommentsByArticleId);
app.post('/api/articles/:article_id/comments', postCommentByArticleId);

app.all('*', (req, res) => {
    res.status(404).send( {msg: 'Not Found'});
});

app.use((err, req, res, next) => {
    if (err.status && err.msg) {
      res.status(err.status).send({ msg: err.msg });
    } 
});

app.use((err, req, res, next) => {
  if (err.status) {
    return res.status(err.status).send({ msg: err.msg });
  }
  res.status(500).send({ msg: 'Server Error' });
});

module.exports = app;