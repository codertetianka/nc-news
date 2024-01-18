const {
  selectArticles,
  getArticleByIdModel,
  getAllArticlesModel,
} = require("../models/articles-model");

exports.getArticleByIdController = async (req, res, next) => {
  try {
    const article_id = req.params.article_id;

    const article = await getArticleByIdModel(article_id);

    res.status(200).send({ article });
  } catch (err) {
    if (err.message === "Not found") {
      res.status(404).send({ msg: "Not Found" });
    }
    console.error("An error occurred", err);
    next(err);
  }
};

exports.getAllArticlesController = async (req, res, next) => {
  try {
    const article = await getAllArticlesModel();

    res.status(200).send({ article });
  } catch (err) {
    console.error(err);
    if (err.message === "Not found") {
      res.status(404).send({ msg: "Not Found" });
    }
    console.error("An error occurred", err);
    next(err);
  }
};

// exports.patchArticleById = async (req, res, next) => {
//   try {
//     const { article_id } = req.params;
//     const newVote = req.body;

//     const article = await patchArticle(article_id, newVote);
//     res.status(200).send(article);
//   } catch (error) {
//     next(error);
//   }
// };
