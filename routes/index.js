var express = require('express');
var router = express.Router();
var Book = require('../models/book');
var Setbook = require('../models/setbook');
var User = require('../models/user');


/* GET home page. */
router.get('/', function(req, res, next) {
    // keyword for searching
    var key = req.query.search;
    // the parameter for sorting
    var sort = req.query.sort;
    if (sort === 'price'){
        sort = 'min_price';
    }
    // If there is no searching
    if (key == null){
        // If there is no sorting keyword, return all books
        if (sort == null){
            Setbook.find({}, function(error, setbooks){
                res.render('index', {
                    title: 'PickleLeaf',
                    books: setbooks,
                    keyword: null
                })
            })
            // if there is sorting, sort by that parameter
        } else {
            Setbook.find().sort(sort).exec(function(error, setbooks){
                res.render('index', {
                    title: 'PickleLeaf',
                    books: setbooks,
                    keyword: null
                })
            })
        }
    // IF there is a search keyword
    } else {
        var keyword = new RegExp(key, 'i');
        // But if there is not sorting
        if (sort == null){

            // Return the books searched using the search keyword
            Setbook.find({$or: [{title: keyword}, {author: keyword}, {course: keyword}]}, function(err, setbooks){
                if (err) return handleError(err);
                // If there are no books, then return no books
                if (setbooks == null) {
                    Setbook.find({}, function (error, setbooks) {
                        res.render('index', {
                            title: 'PickleLeaf',
                            books: setbooks,
                            keyword: null
                        })
                    })
                }else{

                    res.render('index', {
                        title: 'PickleLeaf',
                        books: setbooks,
                        keyword: key
                    })
                }
            })
            // If there is a sort keyword, return books sorted by that keyword
        } else {
            Setbook.find({$or: [{title: keyword}, {author: keyword}, {course: keyword}]}).sort(sort).exec(function(err, setbooks){
                if (err) return handleError(err);

                if (setbooks == null) {
                    Setbook.find({}, function (error, setbooks) {
                        res.render('index', {
                            title: 'PickleLeaf',
                            errors: false,
                            books: setbooks,
                            keyword: null
                        })
                    })
                }else{

                    res.render('index', {
                        title: 'PickleLeaf',
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

  Setbook.findById(setbookid).populate({path: 'books', populate: {path: 'sellerId'}}).exec(function (err, setbook) {
    if (err){
        res.render('error', {
            message: 'Book not Found',
            error: err,
            title: 'PickleLeaf'
        })
    }else{
        console.log(setbook);
        console.log(setbook.books.sellerId);
        var book = new Book();

        res.render('setbook', {
            title: 'PickleLeaf',
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

  Book.findById(bookid).populate('setbookID').populate('sellerId').exec(function (err, book) {
    if (err){
        res.render('error', {
            message: 'Book not Found',
            error: err,
            title: 'PickleLeaf'
        })
    }else{

        if (book.sold){
            avail = 'Sold';
        }else{
            avail = 'Available';
        }
        res.render('book', {
            title: 'PickleLeaf',
            book_id: bookid,
            book_title: book.setbookID.title,
            author: book.setbookID.author,
            course: book.setbookID.course,
            price: book.price,
            description: book.description,
            sellerId: book.sellerId,
            avail: avail,
            sold: book.sold,
            imageURL: book.setbookID.imageURL,
            setbook_id: book.setbookID._id
        })
    }
  });
});

module.exports = router;
