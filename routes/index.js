var express = require('express');
var router = express.Router();
var Book = require('../models/book');


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'UW Textbooks' });
});

/* GET book page */
router.get('/book/:bookid', function(req, res, next){
  var bookid =req.params.bookid;
  var book = new Book();

  Book.findOne({ '_id': bookid }, 'title author price course description username', function (err, book) {
    if (err) return handleError(err);
    res.render('book', {
      title: 'UW Textbooks',
        book_id: bookid,
        book_title: book.title,
        author: book.author,
        course: book.course,
        price: book.price,
        description: book.description,
        seller: book.username
    })
  });
});


module.exports = router;
