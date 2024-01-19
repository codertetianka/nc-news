const {
  getArticleByIdModel,
  getAllArticlesModel,
  patchArticleModel,
} = require("../models/articles-model");

exports.getArticleByIdController = async (req, res, next) => {
  try {
    const article_id = req.params.article_id;

    const article = await getArticleByIdModel(article_id);

    res.status(200).send({ article });
  } catch (err) {
    console.error("An error occurred", err);
    next(err);
  }
};

exports.getAllArticlesController = async (req, res, next) => {
  try {
    const topic = req.query.topic;
    const articles = await getAllArticlesModel(topic);

    res.status(200).send({ articles });
  } catch (err) {
    console.error(err);
    if (err.message === "Not Found") {
      res.status(404).send({ msg: "Not Found" });
    }
    console.error("An error occurred", err);
    next(err);
  }
};

exports.patchArticleById = async (req, res, next) => {
  try {
    const { article_id } = req.params;
    const { newVote } = req.body;

    const article = await patchArticleModel(article_id, newVote);

    if (!article) {
      return res.status(404).send({ err: "Article Not Found" });
    }

    res.send({ article });
  } catch (err) {
    next(err);
  }
};
