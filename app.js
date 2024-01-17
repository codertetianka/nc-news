const express = require("express");
const app = express();

const {
  getAllTopics
} = require("./controllers/topics.controller");

const {
  getApi
} = require("./controllers/api.controller");

const {
  getArticleByIdController
} = require("./controllers/articles-controller");

const {
  getAllArticlesController 
} = require("./controllers/articles-controller")

app.get("/api/articles", getAllArticlesController);
app.get("/api", getApi);
app.get("/api/topics", getAllTopics);
app.get('/api/articles/:article_id', getArticleByIdController);

app.use((err, req, res, next) => {
    if (err) {
      res.status(500).send({ msg: "Something went wrong!"});
    }
});

module.exports = app;
