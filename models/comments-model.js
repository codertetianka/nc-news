const db = require("../db/connection");

exports.getArticleCommentsModel = async (article_id) => {
  const { rows } = await db.query(`
    SELECT *
    FROM comments
    WHERE article_id = ${article_id}
    ORDER BY created_at DESC
  `);

  if (!rows.length) {
    throw new Error("Not Found");
  }

  return rows;
};

exports.postCommentModel = async ({ username, body }, article_id) => {
  try {
    if (!username || !body) {
      throw new Error("Bad Request");
    }

    const { rows } = await db.query(
      `INSERT INTO comments (author, body, article_id)
        VALUES ($1, $2, $3) RETURNING *`,
      [username, body, +article_id]
    );

    return rows[0];
  } catch (error) {
    throw error;
  }
};

exports.deleteCommentsModel = async (comment_id) => {
  try {
    const { rows } = await db.query(
      "DELETE FROM comments WHERE comment_id = $1 RETURNING *;",
      [comment_id]
    );

    if (!rows.length) {
      throw new Error("comment does not exist");
    }

    return rows;
  } catch (error) {
    throw error;
  }
};
