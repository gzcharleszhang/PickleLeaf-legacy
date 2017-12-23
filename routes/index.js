var express = require('express');
var router = express.Router();
var mongo = require('mongodb');
var assert = require('assert');

var url = 'mongodb://localhost:27017/test'

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'UW Textbooks' });
});

/* GET submitted page */
router.get('/submitted/:bookid', function(req, res, next){
  res.render('submitted', {
    title: 'UW Textbooks', book_id: req.params.bookid
  })
});


module.exports = router;
