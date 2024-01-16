const { selectArticles, getArticleByIdModel } = require("../models/articles-model");

exports.getArticleByIdController = async (req, res, next) => {
    try {

        const article_id = req.params.article_id;

       

        const article = await getArticleByIdModel(article_id);



        res.status(200).send({article});

        
    }
    catch (err) {

        if (err.message === 'Not found') {
            res.status(404).send({msg: 'Not found'})
        }
        console.error('An error occurred', err);
        next(err);
    }
  
    
};

