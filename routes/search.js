var express = require('express');
var router = express.Router();
var session = require('express-session');
var Book = require('../models/book');
var Setbook = require('../models/setbook');


// GET search page
router.get('/', ensureAuthenticated, function(req, res, next){
    res.render('search', {
        title: 'UW Textbooks',
        errors: false,
        setbooks: {}
    })
});

// POST search page
router.post('/', ensureAuthenticated, function(req, res, next){
    var keyword = new RegExp(req.body.keyword, 'i');


    // Validation
    req.checkBody('keyword', 'The search field cannot be empty').notEmpty();

    var errors = req.validationErrors();

    if (errors) {
        res.render('search', {
            title: 'UW Textbooks',
            errors: errors,
            setbooks: {}
        });
    } else {
        /*
        Setbook.find({title: keyword}, 'title author course _id', function (err, setbooks_title) {
            if (err) return handleError(err);

            Setbook.find({author: keyword}, 'title author course _id', function (err, setbooks_author) {
                if (err) return handleError(err);

                Setbook.find({course: keyword}, 'title author course _id', function (err, setbooks_course) {
                    if (err) return handleError(err);

                    var temp = setbooks_course.concat(setbooks_author);
                    var setbooks = temp.concat(setbooks_title);
                    res.render('search', {
                        title: 'UW Textbooks',
                        errors: false,
                        setbooks: setbooks
                    })
                });
            });
        }); */
        Setbook.find({$or: [{title: keyword}, {author: keyword}, {course: keyword}]}, function(err, setbooks){
            if (err) return handleError(err);

            res.render('search', {
                title: 'UW Textbooks',
                errors: false,
                setbooks: setbooks
            })
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
