const express = require("express");
const app = express();

const {
    getAllTopics
} = require("./controllers/topics.controller");

const {
    getApi
} = require("./controllers/api.controller");

app.get("/api", getApi);
app.get("/api/topics", getAllTopics);
module.exports = app;