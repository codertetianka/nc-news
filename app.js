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

const {
  getArticleCommentsController 
} = require("./controllers/comment-controller")




app.get("/api", getApi);

app.get("/api/topics", getAllTopics);

app.get("/api/articles", getAllArticlesController);
app.get('/api/articles/:article_id', getArticleByIdController);
app.get("/api/articles/:article_id/comments", getArticleCommentsController);

app.use((err, req, res, next) => {
    if (err) {
      if (err.message === 'Not found') {
        res.status(404).send({ msg: err.message});  
      } else {
        res.status(500).send({ msg: "Something went wrong!"});
      }
      
      console.error("An error occurred", err);
    }
});

module.exports = app;
