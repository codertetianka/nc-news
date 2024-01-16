const db = require("../db/connection");

exports.getArticleByIdModel = async (article_id) => {
  const {rows} = await db.query(`SELECT * FROM articles WHERE article_id = ${article_id}`);

  if (!rows.length) {
    throw new Error('Not found')
  }
  return rows[0];
};

