const db = require("../db/connection");

exports.getArticleByIdModel = async (article_id) => {
  const { rows } = await db.query(
    `SELECT * FROM articles WHERE article_id = ${article_id}
    
    `
  );

  if (!rows.length) {
    throw new Error("Not Found");
  }
  return rows[0];
};

exports.getAllArticlesModel = async (topic) => {
  let query = `
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
  `;

  if (topic) {
    query += `WHERE articles.topic = $1`;
  }

  query += `
    GROUP BY articles.article_id
    ORDER BY articles.created_at DESC
  `;

  const { rows } = await db.query(query, topic ? [topic] : []);

  if (!rows.length) {
    throw new Error("Not Found");
  }

  return rows;
};

exports.patchArticleModel = async (article_id, newVote) => {
  try {
    const result = await db.query(
      "UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *;",
      [newVote, article_id]
    );

    return result.rows[0];
  } catch (error) {
    throw error;
  }
};

exports.postArticleModel = async ({
  title,
  topic,
  author,
  body,
  created_at,
  article_img_url,
}) => {
  try {
    const { rows } = await db.query(
      `INSERT INTO articles (title, topic, author, body, created_at, article_img_url)
        VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [title, topic, author, body, created_at, article_img_url]
    );

    return rows[0];
  } catch (error) {
    throw error;
  }
};
