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

app.use((err, req, res, next) => {
  if (err) {
    res.status(500).send("Something went wrong!");
  }
  
});

app.get("/api", getApi);
app.get("/api/topics", getAllTopics);
app.get('/api/articles/:article_id', getArticleByIdController);

module.exports = app;
