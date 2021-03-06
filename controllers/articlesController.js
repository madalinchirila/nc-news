const { fetchArticleById, updateArticle, selectAllArticles } = require('../models/articlesModel');

exports.sendArticleById = (req, res, next) => {
  const { article_id } = req.params;
  fetchArticleById(article_id)
    .then(article => {
      res.status(200).send({ article });
    })
    .catch(next);
};
//     .then(([article]) => {
//       if (!article) {
//         next({
//           status: 404,
//           msg: 'Article not found.'
//         })
//       } 
//         else {
//         res.status(200).send({ article });
//       }
//     })
//     .catch(next);
// };

exports.sendUpdatedArticle = (req, res, next) => {
  const { article_id } = req.params;
  const { inc_votes } = req.body;
  if (inc_votes === undefined) next({ status: 400, msg: 'Bad Request' });
  else if (Object.keys(req.body).length > 1)
    next({ status: 400, msg: 'Unexpected keys' });
  else {
    updateArticle(article_id, inc_votes)
      .then(([article]) => {
        if (!article) {
          next({
            article,
            status: 404,
            msg: `Article_id: ${article_id} not found`
          });
        } else {
          res.status(200).send({ article });
        }
      })
      .catch(next);
  }
};

exports.sendAllArticles = (req, res, next) => {
  const { sort_by = 'created_at', order = 'desc', author, topic } = req.query;
  if (order === 'asc' || order === 'desc') {
    selectAllArticles(sort_by, order, author, topic)
      .then(articlesArray => {
        res.status(200).send({ articles: articlesArray });
      })
      .catch(next);
  } else {
    next({ status: 400, msg: 'Invalid Order' });
  }
};