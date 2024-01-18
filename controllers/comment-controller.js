const {
  postCommentModel: postComment,
  getArticleCommentsModel,
  postCommentModel,
} = require("../models/comments-model");

exports.postCommentController = async (req, res, next) => {
  try {
    const newComment = req.body;
    const article_id = req.params.article_id;

    const comment = await postCommentModel(newComment, article_id);

    res.status(201).send({ comment });
  } catch (error) {
    next(error);
  }
};

exports.getArticleCommentsController = async (req, res, next) => {
  try {
    const article_id = req.params.article_id;

    const comments = await getArticleCommentsModel(article_id);

    res.status(200).send({ comments });
  } catch (err) {
    next(err);
  }
};
