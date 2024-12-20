const db = require('../db/connection');

function fetchArticleById(article_id) {
    return db
        .query('SELECT * FROM articles WHERE article_id = $1;', [article_id])
        .then(({ rows }) => {
            if (rows.length === 0) {
                return Promise.reject({ status: 404, msg: 'Article not found' });
            }
            return rows[0];
        });
};

function fetchArticles(sort_by, order) {
    if (!sort_by) {
        sort_by = 'created_at';
    }
    if (!order) {
        order = 'desc';
    }
    const validSortColumns = ['article_id', 'title', 'topic', 'author', 'created_at', 'votes'];
    const validOrders = ['asc', 'desc'];

    if (!validSortColumns.includes(sort_by)) {
        return Promise.reject({ status: 400, msg: 'Invalid sort_by column' });
    }

    if (!validOrders.includes(order)) {
        return Promise.reject({ status: 400, msg: 'Invalid order query' });
    }

    return db.query(
        `SELECT 
            articles.author, 
            articles.title, 
            articles.article_id, 
            articles.topic, 
            articles.created_at, 
            articles.votes, 
            articles.article_img_url,
            COUNT(comments.comment_id) AS comment_count
        FROM articles
        LEFT JOIN comments ON articles.article_id = comments.article_id
        GROUP BY articles.article_id
        ORDER BY ${sort_by} ${order};`
    ).then(({ rows }) => {
        return rows.map((article) => ({
            ...article,
            comment_count: Number(article.comment_count),
        }));
    });
}

function updateArticleVotes(article_id, inc_votes) {
    return db.query(
      `
      UPDATE articles
      SET votes = votes + $2
      WHERE article_id = $1
      RETURNING *;
      `,
      [article_id, inc_votes]
    )
      .then(({ rows }) => {
        if (rows.length === 0) {
          return Promise.reject({ status: 404, msg: 'Article not found' });
        }
        return rows[0];
      });
  };

module.exports = { fetchArticleById, fetchArticles, updateArticleVotes };
