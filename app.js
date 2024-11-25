const express = require('express');
const app = express();
const getApi = require("./controllers/api.controller");
const getTopics = require('./controllers/topics.controller');

app.get('/api', getApi);
app.get('/api/topics', getTopics);

app.all('*', (req, res) => {
    res.status(404).send( {msg: 'Not Found'});
});

module.exports = app;