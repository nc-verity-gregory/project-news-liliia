const express = require('express');
const app = express();
const getApi = require("./controllers/api.controller");
const getTopics = require('./controllers/topics.controller');
const { getArticleById, getArticles } = require('./controllers/articles.controller');

app.get('/api', getApi);
app.get('/api/topics', getTopics);
app.get('/api/articles', getArticles);
app.get('/api/articles/:article_id', getArticleById);

app.all('*', (req, res) => {
    res.status(404).send( {msg: 'Not Found'});
});

module.exports = app;