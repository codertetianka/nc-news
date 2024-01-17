const db = require("../db/connection");

exports.getArticleCommentsModel = async (article_id) => {
  const { rows } = await db.query(`
    SELECT *
    FROM comments
    WHERE article_id = ${article_id}
    ORDER BY created_at DESC
  `);

  if (!rows.length) {
    throw new Error('Not found');
  }

  return rows;
};