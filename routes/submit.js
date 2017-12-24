var express = require('express');
var router = express.Router();
var session = require('express-session');
var Book = require('../models/book');

/* GET submission page */
router.get('/', ensureAuthenticated, function(req, res, next){
    res.render('submit', { 
        title: 'UW Textbooks',
        errors: false 
    });
});

/* POST book submission */
router.post('/', ensureAuthenticated, function(req, res, next){
    var title = req.body.title;
    var author = req.body.author;
    var course = req.body.course;
    var price = req.body.price;
    var description = req.body.description;
    var username = req.user.username;

    // Validation
    req.checkBody('title', 'Title is required').notEmpty();
    req.checkBody('author', 'Author is required').notEmpty();
    req.checkBody('course', 'Course is required').notEmpty();
    req.checkBody('price', 'Price is required').notEmpty();
    req.checkBody('description', 'Description is required').notEmpty();

    var errors = req.validationErrors();

    if (errors) {
        res.render('submit', {
            title: 'UW Textbooks',
            errors: errors
        });
    } else {
        var newBook = new Book ({
            title: title,
            author: author,
            course: course,
            price: price,
            description: description,
            username: username
        });

        Book.createBook(newBook, function(err, book){
            if(err) throw err;
            console.log(book);
        });

        req.flash('success_msg', 'You have successfully submitted a book.');

        res.redirect('/submit');
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
