var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'UW Textbooks' });
});

/* GET submitted page */
router.get('/submitted/:bookid', function(req, res, next){
  res.render('submitted', {
    title: 'UW Textbooks', output: req.params.bookid
  })
});

module.exports = router;
