const { fetchArticleById, fetchArticles } = require('../models/articles.model');

function getArticleById(req, res, next) {
    const { article_id } = req.params;

    if (isNaN(article_id)) {
        return res.status(400).send({ msg: 'Invalid article_id' });
    };

    fetchArticleById(article_id)
        .then((article) => {
            res.status(200).send({ article });
        })
        .catch(next);
};

function getArticles(req, res, next) {
    fetchArticles()
        .then((articles) => {
            const deleteBody = articles.map(({ body, ...rest }) => rest);
            res.status(200).send({ articles: deleteBody });
        })
        .catch(next);
};



module.exports = { getArticleById, getArticles };

