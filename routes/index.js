var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'UW Textbooks' });
});

/* GET submission page */
router.get('/submit', function(req, res, next){
  res.render('submit', { title: 'UW Textbooks' });
});

/* GET submitted page */
router.get('/submitted/:bookid', function(req, res, next){
  res.render('submitted', {
    title: 'UW Textbooks', output: req.params.bookid
  })
});

/* POST book submission */
router.post('/submit', function(req, res, next){
  res.redirect('/submitted/' + req.body.bookid)
});
module.exports = router;
