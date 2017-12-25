var express = require('express');
var router = express.Router();
var Book = require('../models/book');


/* GET home page. */
router.get('/', function(req, res, next) {
  Book.find({}, 'title author course price description _id', function (err, books) {
    console.log(books);
    res.render('index', {
      title: 'UW Textbooks',
      books: books,
    })
  })
});

/* GET book page */
router.get('/book/:bookid', function(req, res, next){
  var bookid =req.params.bookid;
  var book = new Book();
  var avail;

  Book.findOne({ '_id': bookid }, 'title author price course description username sold', function (err, book) {
    if (err) return handleError(err);
    if (book.sold){
      avail = 'Book Sold';
    }else{
      avail = 'Book Available';
    }
    res.render('book', {
      title: 'UW Textbooks',
        book_id: bookid,
        book_title: book.title,
        author: book.author,
        course: book.course,
        price: book.price,
        description: book.description,
        seller: book.username,
        avail: avail
    })
  });
});

module.exports = router;
