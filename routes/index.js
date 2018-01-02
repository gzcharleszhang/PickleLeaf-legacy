var express = require('express');
var router = express.Router();
var Book = require('../models/book');
var Setbook = require('../models/setbook');


/* GET home page. */
router.get('/', function(req, res, next) {
    var key = req.query.search;
    var sort = req.query.sort;
    if (key == null){
        if (sort == null){
            Setbook.find({}, function(error, setbooks){
                res.render('index', {
                    title: 'UW Textbooks',
                    books: setbooks,
                    keyword: null
                })
            })
        } else {
            Setbook.find().sort(sort).exec(function(error, setbooks){
                res.render('index', {
                    title: 'UW Textbooks',
                    books: setbooks,
                    keyword: null
                })
            })
        }

    } else {
        var keyword = new RegExp(key, 'i');
        if (sort == null){

            Setbook.find({$or: [{title: keyword}, {author: keyword}, {course: keyword}]}, function(err, setbooks){
                if (err) return handleError(err);

                if (setbooks == null) {
                    Setbook.find({}, function (error, setbooks) {
                        res.render('index', {
                            title: 'UW Textbooks',
                            books: setbooks,
                            keyword: null
                        })
                    })
                }else{

                    res.render('index', {
                        title: 'UW Textbooks',
                        books: setbooks,
                        keyword: key
                    })
                }
            })
        } else {
            Setbook.find({$or: [{title: keyword}, {author: keyword}, {course: keyword}]}).sort(sort).exec(function(err, setbooks){
                if (err) return handleError(err);

                if (setbooks == null) {
                    Setbook.find({}, function (error, setbooks) {
                        res.render('index', {
                            title: 'UW Textbooks',
                            errors: false,
                            books: setbooks,
                            keyword: null
                        })
                    })
                }else{

                    res.render('index', {
                        title: 'UW Textbooks',
                        errors: false,
                        books: setbooks,
                        keyword: key
                    })
                }
            })

        }

    }
});


// GET setbook page
router.get('/setbook/:setbookid', function(req, res, next){
  var setbookid = req.params.setbookid;
  var setbook = new Setbook();

  Setbook.findById(setbookid).populate('books').exec(function (err, setbook) {
    if (err){
        res.render('error', {
            message: 'Book not Found',
            error: err,
            title: 'UW Textbooks'
        })
    }else{
        console.log(setbook);
        var book = new Book();

        res.render('setbook', {
            title: 'UW Textbooks',
            booktitle: setbook.title,
            author: setbook.author,
            course: setbook.course,
            setbookid: setbookid,
            books: setbook.books,
            imageURL: setbook.imageURL
        })
    }

  })
});


/* GET book page */
router.get('/book/:bookid', function(req, res, next){
  var bookid =req.params.bookid;
  var book = new Book();
  var avail;

  Book.findById(bookid).populate('setbookID').exec(function (err, book) {

    if (err){
        res.render('error', {
            message: 'Book not Found',
            error: err,
            title: 'UW Textbooks'
        })
    }else{

        console.log(book.setbookID);

        if (book.sold){
            avail = 'Book Sold!';
        }else{
            avail = 'Book Available!';
        }
        res.render('book', {
            title: 'UW Textbooks',
            book_id: bookid,
            book_title: book.setbookID.title,
            author: book.setbookID.author,
            course: book.setbookID.course,
            price: book.price,
            description: book.description,
            seller: book.username,
            avail: avail,
            sold: book.sold,
            imageURL: book.setbookID.imageURL
        })
    }
  });
});

module.exports = router;
