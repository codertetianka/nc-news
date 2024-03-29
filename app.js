const express = require("express");
const bodyParser = require("body-parser");
const app = express();
app.use(bodyParser.json());
const cors = require("cors");

const {
  getAllTopics,
  postTopicController,
} = require("./controllers/topics.controller");

const { getApi } = require("./controllers/api.controller");

const {
  getAllArticlesController,
  patchArticleById,
  getArticleByIdController,
  postArticleController,
} = require("./controllers/articles-controller");

const {
  getArticleCommentsController,
  postCommentController,
  deleteCommentByIdController,
} = require("./controllers/comment-controller");

const { getUsersController } = require("./controllers/users.controller");
app.use(cors());
app.get("/api", getApi);

app.get("/api/topics", getAllTopics);
app.post("/api/topics", postTopicController);

app.get("/api/articles", getAllArticlesController);
app.post("/api/articles", postArticleController);
app.get("/api/articles/:article_id", getArticleByIdController);

app.post("/api/articles/:article_id/comments", postCommentController);
app.get("/api/articles/:article_id/comments", getArticleCommentsController);
app.patch("/api/articles/:article_id", patchArticleById);
app.delete("/api/comments/:comment_id", deleteCommentByIdController);
app.get("/api/users", getUsersController);

app.use((err, req, res, next) => {
  if (err) {
    if (
      err.message === "Not Found" ||
      err.message.indexOf("does not exist") !== -1 ||
      err.message.indexOf("violates foreign key") !== -1
    ) {
      res.status(404).send({ msg: "Not Found" });
    } else if (
      err.message === "Bad Request" ||
      err.message.indexOf("invalid input syntax") !== -1
    ) {
      res.status(400).send({ msg: "Bad Request" });
    } else {
      res.status(500).send({ msg: "Something went wrong!" });
    }

    console.error("An error occurred", err);
  }
});

module.exports = app;
