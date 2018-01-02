var express = require('express');
var router = express.Router();
var session = require('express-session');
var Book = require('../models/book');
var Setbook = require('../models/setbook');


// GET sell page
router.get('/', ensureAuthenticated, function(req, res, next){
    var key = req.query.search;
    var sort = req.query.sort;
    if (key == null){
        if (sort == null){
            Setbook.find({}, function(error, setbooks){
                res.render('sell', {
                    title: 'UW Textbooks',
                    errors: false,
                    setbooks: setbooks,
                    keyword: null
                })
            })
        } else {
            Setbook.find().sort(sort).exec(function(error, setbooks){
                res.render('sell', {
                    title: 'UW Textbooks',
                    errors: false,
                    setbooks: setbooks,
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
                        res.render('sell', {
                            title: 'UW Textbooks',
                            errors: false,
                            setbooks: setbooks,
                            keyword: null
                        })
                    })
                }else{

                    res.render('sell', {
                        title: 'UW Textbooks',
                        errors: false,
                        setbooks: setbooks,
                        keyword: key
                    })
                }
            })
        } else {
            Setbook.find({$or: [{title: keyword}, {author: keyword}, {course: keyword}]}).sort(sort).exec(function(err, setbooks){
                if (err) return handleError(err);

                if (setbooks == null) {
                    Setbook.find({}, function (error, setbooks) {
                        res.render('sell', {
                            title: 'UW Textbooks',
                            errors: false,
                            setbooks: setbooks,
                            keyword: null
                        })
                    })
                }else{

                    res.render('sell', {
                        title: 'UW Textbooks',
                        errors: false,
                        setbooks: setbooks,
                        keyword: key
                    })
                }
            })

        }

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
