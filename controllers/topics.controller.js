const { selectTopics, postTopic } = require("../models/topics-model");

exports.getAllTopics = async (req, res, next) => {
  try {
    const topics = await selectTopics();

    res.status(200).send({ topics });
  } catch (err) {
    next(err);
  }
};

exports.postTopicController = async (req, res, next) => {
  try {
    const { topic } = req.body;

    const topicCreated = await postTopic(topic);

    if (!topicCreated) {
      return res.status(404).send({ err: "Topic Not Found" });
    }

    res.status(201).send({ topic: topicCreated });
  } catch (err) {
    next(err);
  }
};
