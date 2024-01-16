const { selectArticles, getArticleByIdModel } = require("../models/articles-model");

exports.getArticleByIdController = async (req, res, next) => {
    try {

        const article_id = req.params.article_id;

        if (article_id === undefined || isNaN(article_id)) {
            res.status(400).send({msg: 'Bad request'})
        }

        const article = await getArticleByIdModel(article_id);


        if (!article) {     

            res.status(404).send({msg: 'Not found'})

            return;
         }
   

        res.status(200).send({article});

        
    }
    catch (err) {
        console.error('[err]', err);
        next(err);
    }
  
    
};

