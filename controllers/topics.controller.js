const { selectTopics } = require("../models/topics-model");

exports.getAllTopics = async (req, res, next) => {
    try {
        const topics = await selectTopics();

        console.log('[topics]', topics);
        if (!topics.length) {
            res.status(404).send({msg: 'No topics found'});
        } else {
            res.status(200).send({topics});
        }
        
    }
    catch (err) {
        next(err);
    }
  
};