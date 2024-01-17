const { getArticleCommentsModel } = require("../models/comments-model");

exports.getArticleCommentsController = async (req, res, next) => {
  try {
    const article_id = req.params.article_id;

    const comments = await getArticleCommentsModel(article_id);

    res.status(200).send({ comments });
  } catch (err) {
   
    next(err);
  }
};
