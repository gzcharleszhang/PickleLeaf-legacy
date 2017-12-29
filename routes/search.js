var express = require('express');
var router = express.Router();
var session = require('express-session');
var Book = require('../models/book');
var Setbook = require('../models/setbook');


// GET search page
router.get('/', ensureAuthenticated, function(req, res, next){
    Setbook.find({}, function(error, setbooks){
        res.render('search', {
            title: 'UW Textbooks',
            errors: false,
            setbooks: setbooks
        })
    })
});

// POST search page
router.post('/', function(req, res, next){
    var keyword = new RegExp(req.body.keyword, 'i');
    console.log(req.body.homepage);
    var errors = req.validationErrors();
    if (errors) {
        res.render('search', {
            title: 'UW Textbooks',
            errors: errors,
            setbooks: {}
        });
    } else {
        Setbook.find({$or: [{title: keyword}, {author: keyword}, {course: keyword}]}, function(err, setbooks){
            if (err) return handleError(err);

            if (setbooks == null) {
                Setbook.find({}, function (error, setbooks) {
                    res.render('search', {
                        title: 'UW Textbooks',
                        errors: false,
                        setbooks: setbooks
                    })
                })
            }else{

                res.render('search', {
                    title: 'UW Textbooks',
                    errors: false,
                    setbooks: setbooks
                })
            }
        })
    }
});

// POST search page
router.post('/home', function(req, res, next){
    var keyword = new RegExp(req.body.keyword, 'i');
    console.log(req.body.homepage);
    var errors = req.validationErrors();
    if (errors) {
        res.render('search', {
            title: 'UW Textbooks',
            errors: errors,
            setbooks: {}
        });
    } else {
        Setbook.find({$or: [{title: keyword}, {author: keyword}, {course: keyword}]}, function(err, setbooks){
            if (err) return handleError(err);

            if (setbooks == null) {
                Setbook.find({}, function (error, setbooks) {
                    res.render('search', {
                        title: 'UW Textbooks',
                        errors: false,
                        setbooks: setbooks
                    })
                })
            }else{

                res.render('index', {
                    title: 'UW Textbooks',
                    books: setbooks
                })
            }
        })
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
