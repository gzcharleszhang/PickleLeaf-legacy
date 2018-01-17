var express = require('express');
var router = express.Router();
var session = require('express-session');
var Book = require('../models/book');
var Setbook = require('../models/setbook');
var Soldbook = require('../models/soldbook');
var User = require('../models/user');
var mongoose = require('mongoose');
var Rating = require('../models/rating');

// GET setbook submission page
router.get('/setbook', ensureAuthenticated, function(req, res, next){
   res.render('submit_setbook', {
       title: 'PickleLeaf',
       errors: false
   })
});


// POST setbook submission
router.post('/setbook', ensureAuthenticated, function(req, res, next){
    var title = req.body.title;
    var author = req.body.author;
    var course = req.body.course;
    var imageURL = req.body.imageURL;

    // Validation
    req.checkBody('title', 'Title is required').notEmpty();
    req.checkBody('author', 'Author is required').notEmpty();
    req.checkBody('course', 'Course is required').notEmpty();
    req.checkBody('imageURL', 'Image URL is required').notEmpty();

    var errors = req.validationErrors();

    if (errors) {
        res.render('submit_setbook', {
            title: 'PickleLeaf',
            errors: errors
        });
    } else {
        var newSetbook = new Setbook ({
            title: title,
            author: author,
            course: course,
            imageURL: imageURL,
            min_price: -1,
            books: []
        });

        Setbook.createBook(newSetbook, function(err, setbook){
            if(err) throw err;
            console.log(setbook);
        });

        req.flash('success_msg', 'You have successfully submitted a setbook.');

        res.redirect('/submit/setbook');
    }
});

/* GET book purchasing page*/
router.get('/purchase/:bookid', ensureAuthenticated, function(req, res, next) {
    var bookid = req.params.bookid;

    Book.findById(bookid).populate('setbookID').exec(function (err, book) {

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
            res.render('purchase', {
                title: 'PickleLeaf',
                errors: false,
                book_id: bookid,
                booktitle: book.setbookID.title,
                author: book.setbookID.author,
                course: book.setbookID.course,
                price: book.price,
                description: book.description,
                seller: book.username,
                avail: avail,
                imageURL: book.setbookID.imageURL
            })
        }
    });
});

/* POST book purchasing page */
router.post('/purchase/:bookid', ensureAuthenticated, function(req, res, next) {
    var bookid = req.params.bookid;
    var buyer = req.user.username;

    // TODO: use message and send to seller
    // Validation
    //req.checkBody('message', 'Personal message is required to notify seller.').notEmpty();

    //var errors = req.validationErrors();
    Book.findById(bookid).exec(function (err, book){
        if (err) {
            res.render('error', {
                message: 'Book not found',
                error: err
            })
        } else {
            User.findById(req.user._id, function(err, user){
                user.cart = user.cart.concat([bookid]);
                user.save(function (err, updatedUser){
                    if (err) throw(err);
                    console.log(updatedUser);
                })
            });

            req.flash('success_msg', 'Your book is now in your shopping cart.');

            res.redirect('/submit/purchase/'+bookid);
        }
    });

});

/* GET book selling page */
router.get('/book/:setbookid', ensureAuthenticated, function(req, res, next){
    var setbookID = req.params.setbookid;

    Setbook.findById(setbookID).populate('books').exec(function(err, setbook){
        if (err){
            res.render('error', {
                message: 'Book not found',
                error: err,
                title: 'PickleLeaf'
            })
        }else{
            res.render('submit', {
                title: 'PickleLeaf',
                errors: false,
                setbookID: setbookID,
                booktitle: setbook.title
            });
        }
    })
});

/* POST book selling */
router.post('/book/:setbookid', ensureAuthenticated, function(req, res, next){
    var price = req.body.price;
    var description = req.body.description;
    var setbookID = req.params.setbookid;
    var sellerId = req.user._id;

    // Validation
    req.checkBody('price', 'Price is required').notEmpty();
    req.checkBody('description', 'Description is required').notEmpty();

    var errors = req.validationErrors();

    Setbook.findById(setbookID, function(err, setbook){
        if (errors) {
            res.render('submit', {
                title: 'PickleLeaf',
                booktitle: setbook.title,
                setbookID: setbookID,
                errors: errors
            })
        } else {
            var newBook = new Book ({
                price: price,
                description: description,
                sellerId: sellerId,
                setbookID: setbookID,
                sold: false
            });

            Book.createBook(newBook, function(err, book){
                if(err) throw err;
                console.log(book);

                setbook.books = setbook.books.concat([book._id]);
                if (setbook.min_price === -1 || price < setbook.min_price){
                    setbook.min_price = price;
                }
                setbook.save(function (err, updatedSetbook) {
                    if (err) throw(err);
                    console.log(updatedSetbook);
                });

                User.findById(req.user._id, function(err, user){
                    console.log(user);
                    console.log(user.booksown);
                    user.booksown = user.booksown.concat([book._id]);
                    user.save(function (err, updatedUser){
                        console.log(updatedUser);
                    })
                })

            });

            req.flash('success_msg', 'You have successfully submitted a book.');

            res.redirect('/setbook/' + setbookID);
        }
    })


});

// GET submit user rating page
router.get('/rating/:receiverId', ensureAuthenticated, function(req, res, next){
    res.render('submit_rating', {
        title: 'PickleLeaf',
        errors: [],
        receiverId: req.params.receiverId
    })
});

// POST submit user rating
router.post('/rating/:receiverId', ensureAuthenticated, function(req, res, next){
    //Validation
    req.checkBody('score', 'You need to submit a score').notEmpty();
    var errors = req.validationErrors();
    var receiverId = req.params.receiverId;
    var rating = new Rating({
        comment: req.body.comment,
        score: req.body.score,
        receiver: receiverId,
        sender: req.user._id
    });
    if (errors){
        res.render('submit_rating', {
            title: 'PickleLeaf',
            errors: errors,
            receiverId: req.params.receiverId
        })
    } else{
        Rating.createRating(rating, function(err, newRating){
            if (err){
                console.log(err);
                throw err;
            }
            console.log(newRating);
        });
        res.redirect('/users/profile/' + receiverId)
    }

});

function ensureAuthenticated(req, res, next){
    if(req.isAuthenticated()){
        return next();
    } else {
        //req.flash('error_msg','You are not logged in');
        res.redirect('/users/login');
    }
}

module.exports = router;
