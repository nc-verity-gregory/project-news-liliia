const { 
    fetchArticleById, 
    fetchArticles, 
    updateArticleVotes 
} = require('../models/articles.model');

function getArticleById(req, res, next) {
    const { article_id } = req.params;

    if (isNaN(article_id)) {
        return res.status(400).send({ msg: 'Invalid article_id' });
    };

    fetchArticleById(article_id)
        .then((article) => {
            res.status(200).send({ article });
        })
        .catch(err => {
            next({ status: 404, msg: 'Article not found' });
          });
};

function getArticles(req, res, next) {
    const { sort_by, order } = req.query;

    fetchArticles(sort_by, order)
        .then((articles) => {
            res.status(200).send({ articles });
        })
        .catch(next);
};

function patchArticleVotes(req, res, next) {
    const { article_id } = req.params;
    const { inc_votes } = req.body;

    updateArticleVotes(article_id, inc_votes)
        .then((updatedArticle) => {
            if (!updatedArticle) {
                return res.status(404).send({ msg: 'Article not found' });
            }
            res.status(200).send({ article: updatedArticle });
        })
        .catch(next);
}

module.exports = { getArticleById, getArticles, patchArticleVotes };

