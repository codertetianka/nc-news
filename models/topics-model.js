const db = require("../db/connection");

exports.selectTopics = async () => {
  const { rows } = await db.query("SELECT * FROM topics");

  return rows;
};

exports.postTopic = async ({ description, slug }) => {
  const { rows } = await db.query(
    `INSERT INTO topics (description, slug)
      VALUES ($1, $2) RETURNING *`,
    [description, slug]
  );

  return rows;
};
