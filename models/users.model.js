const db = require("../db/connection.js");

exports.getUsersModel = async () => {
  try {
    const result = await db.query("SELECT * FROM users");
    return result.rows;
  } catch (error) {
    throw error;
  }
};
