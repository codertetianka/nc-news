const express = require("express");
const app = express();
const bodyParser = require("body-parser");

const { getAllTopics } = require("./controllers/topics.controller");

const { getApi } = require("./controllers/api.controller");

app.use(bodyParser.json());

const {
  getArticleByIdController,
} = require("./controllers/articles-controller");

const {
  getAllArticlesController,
} = require("./controllers/articles-controller");

const {
  getArticleCommentsController,
} = require("./controllers/comment-controller");

const { postCommentController } = require("./controllers/comment-controller");

app.get("/api", getApi);

app.get("/api/topics", getAllTopics);

app.get("/api/articles", getAllArticlesController);
app.get("/api/articles/:article_id", getArticleByIdController);
app.get("/api/articles/:article_id/comments", getArticleCommentsController);

app.post("/api/articles/:article_id/comments", postCommentController);
// app.patch("/api/articles/:article_id", patchArticleById);
app.use((err, req, res, next) => {
  if (err) {
    console.log({ message: err.message, detail: err.detail });
    if (
      err.message === "Not found" ||
      err.message?.indexOf("insert or update on table") !== -1 ||
      err.message?.indexOf("does not exist") !== -1
    ) {
      res.status(404).send({ msg: "Not Found" });
    } else if (
      err.message === "Bad request" ||
      err.message.indexOf("invalid input syntax")
    ) {
      res.status(400).send({ msg: "Bad request" });
    } else {
      res.status(500).send({ msg: "Something went wrong!" });
    }
  }
});

module.exports = app;
