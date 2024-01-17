const { getArticleCommentsModel } = require("../models/comments-model");

exports.getArticleCommentsController = async (req, res, next) => {
  try {
    const article_id = req.params.article_id;

    const comments = await getArticleCommentsModel(article_id);

    res.status(200).send({ comments });
  } catch (err) {
    if (err.message === "Not found") {
      res.status(404).send({ msg: "Not found" });
    }
    console.error("An error occurred", err);
    next(err);
  }
};
