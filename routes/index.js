var express = require('express');
var router = express.Router();
var Book = require('../models/book');
var Setbook = require('../models/setbook');


/* GET home page. */
router.get('/', function(req, res, next) {
  Setbook.find({}, 'title author course _id', function (err, books) {
    console.log(books);
    res.render('index', {
      title: 'UW Textbooks',
      books: books
    })
  })
});


// GET setbook page
router.get('/setbook/:setbookid', function(req, res, next){
  var setbookid = req.params.setbookid;
  var setbook = new Setbook();

  Setbook.findById(setbookid, function (err, setbook) {
    if (err) return handleError(err);
    console.log(setbook);
    var book = new Book();
    Book.find({'setbookID': setbookid}, 'username price description sold', function (err, books){
      if (err) return handleError(err);

      res.render('setbook', {
        title: 'UW Textbooks',
          booktitle: setbook.title,
          author: setbook.author,
          course: setbook.course,
          setbookid: setbookid,
          books: books,
          imageURL: setbook.imageURL
      })
    })
  })
});


/* GET book page */
router.get('/book/:bookid', function(req, res, next){
  var bookid =req.params.bookid;
  var book = new Book();
  var avail;

  Book.findById(bookid, 'price description username sold setbookID', function (err, book) {
    if (err) return handleError(err);
    console.log(book.setbookID);
    Setbook.findById(book.setbookID, 'title author course imageURL', function(err, setbook){
      console.log(setbook);
        if (book.sold){
            avail = 'Book Sold';
        }else{
            avail = 'Book Available';
        }
        res.render('book', {
            title: 'UW Textbooks',
            book_id: bookid,
            book_title: setbook.title,
            author: setbook.author,
            course: setbook.course,
            price: book.price,
            description: book.description,
            seller: book.username,
            avail: avail,
            imageURL: setbook.imageURL
        })
    })
  });
});

module.exports = router;
