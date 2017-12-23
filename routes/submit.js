var express = require('express');
var router = express.Router();
var session = require('express-session');

/* GET submission page */
router.get('/', ensureAuthenticated, function(req, res, next){
    res.render('submit', { title: 'UW Textbooks' });
});

/* POST book submission */
router.post('/', ensureAuthenticated, function(req, res, next){
    var title = req.body.title;
    var author = req.body.author;
    var course = req.body.course;
    var price = req.body.price;
    var description = req.body.description;
    var username = req.user.username;
    res.redirect('/submit');
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
