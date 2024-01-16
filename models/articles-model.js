const db = require("../db/connection");

exports.getArticleByIdModel = async (article_id) => {
  const {rows} = await db.query(`SELECT * FROM articles WHERE article_id = ${article_id}`);

  if (!rows.length) {
    throw new Error('Not found')
  }
  return rows[0];
};

exports.getAllArticlesModel = async () => {
  const { rows } = await db.query(`
    SELECT
      articles.article_id,
      articles.title,
      articles.topic,
      articles.author,
      articles.created_at,
      articles.votes,
      articles.article_img_url,
      COUNT(comments.article_id)::int AS comment_count
    FROM articles
    LEFT JOIN comments
    ON articles.article_id = comments.article_id
    GROUP BY articles.article_id
    ORDER BY articles.created_at DESC
  `);

  if (!rows.length) {
    throw new Error('Not found');
  }

  return rows;
};