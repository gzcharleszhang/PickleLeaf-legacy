var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = require('../models/user');
var Book = require('../models/book');
var Setbook = require('../models/setbook');
var Soldbook = require('../models/soldbook');
var Rating = require('../models/rating');

/* GET register page*/
router.get('/register', function(req, res, next) {
    res.render('register', {
        title: 'UW Textbooks',
        errors: false
    });
});

/* POST user registration */
router.post('/register', function(req, res, next) {
    var name = req.body.name;
    var email = req.body.email;
    var username = req.body.username;
    var password = req.body.password;
    var password2 = req.body.password2;

    // Validation
    req.checkBody('name', 'Name is required').notEmpty();
    req.checkBody('email', 'Email is required').notEmpty();
    req.checkBody('email', 'Email must be in the format example@uwaterloo.ca').matches(/\b(?:@uwaterloo.ca|@edu.uwaterloo.ca)\b/);
    req.checkBody('username', 'Username is required').notEmpty();
    req.checkBody('password', 'Password is required').notEmpty();
    req.checkBody('password2', 'Passwords do not match').equals(req.body.password);

    var errors = req.validationErrors();

    User.find({username: username}, function(err, username_exist){
        User.find({email: email}, function (err, email_exist){
            if(errors) {
                res.render('register', {
                    title: 'UW Textbooks',
                    errors: errors
                });
            }else if ((email_exist.length > 0) && (username_exist.length > 0)){
                req.flash('error_msg', 'Username and email already exists');
                res.redirect('/users/register')
            }else if (email_exist.length > 0){
                req.flash('error_msg', 'Email already exists')
                res.redirect('/users/register')

            }else if (username_exist.length > 0){
                req.flash('error_msg', 'Username already exists')
                res.redirect('/users/register')

            }else {
                var newUser = new User({
                    name: name,
                    email: email,
                    username: username,
                    password: password,
                    booksown: [],
                    bookspurchased: [],
                    cart: []
                });

                User.createUser(newUser, function(err, user){
                    if(err) throw err;
                    console.log(user);
                });

                req.flash('success_msg', 'You are registered and can now login');

                res.redirect('/users/login');
            }
        })

    })

});

// Local Strategy for user authentication
passport.use(new LocalStrategy(
    function(username, password, done) {
        User.getUserByUsername(username, function(err, user){
            if(err) throw err;
            if(!user){
                return done(null, false, {message: 'Your Username and/or Password are invalid.'});
            }

            User.comparePassword(password, user.password, function(err, isMatch){
                if(err) throw err;
                if(isMatch){
                    return done(null, user, {message: 'You are logged in!'});
                } else {
                    return done(null, false, {message: 'Your Username and/or Password are invalid.'});
                }
            });
        });
    }));

// Starts user session
passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    User.getUserById(id, function(err, user) {
        done(err, user);
    });
});

// GET login page
router.get('/login', function(req, res, next) {
    res.render('login', {
        title: 'UW Textbooks'
    })
});

// POST login page
router.post('/login',
    passport.authenticate('local', {failureRedirect:'/users/login', failureFlash: true}),
    function(req, res) {
        req.flash('success_msg', 'You are now logged in!');
        res.redirect('/');

});

// GET logout page
router.get('/logout', ensureAuthenticated, function(req, res){
    req.logout();

    req.flash('success_msg', 'You successfully logged out!');

    res.redirect('/users/login');
});

// GET dashboard page
router.get('/dashboard', ensureAuthenticated, function(req, res, next){
    Book.find({sellerId: req.user._id}).populate('setbookID').exec(function (err, booksown) {
        Soldbook.find({buyer: req.user._id}).populate({
            path: 'bookID',
            populate: {path: 'setbookID'}
        }).exec(function (err, bookspurchased){
            console.log(bookspurchased);
            res.render('dashboard', {
                title: 'UW Textbooks',
                books: booksown,
                bookspurchased: bookspurchased,
                username: req.user.username
            })
        })

    })
});

// GET shopping cart page
router.get('/cart', ensureAuthenticated, function(req, res, next){
   User.findById(req.user._id).populate({path: 'cart', populate: {path: 'setbookID'}}).exec(function (err, user){
       res.render('cart', {
           title: 'UW Textbooks',
           books: user.cart
       })
   })
});

// POST shopping cart items
router.post('/cart', ensureAuthenticated, purchaseBooks, function(req, res, next){

    req.flash('success_msg', 'You have successfully sent a book purchase request. The seller will notify you.');

    /* TODO: Add to purchase history/ populate books purchased by buyer */
    res.redirect('/users/dashboard/');
});

function purchaseBooks(req, res, next){
    var buyer = req.user._id;
    User.findById(req.user._id, function(err, user){

        user.cart.forEach(function (bookid){

            Book.findById(bookid).exec(function (err, book) {


                // Changes book to sold status
                if (!book.sold){
                    book.sold = true;
                }
                book.save(function (err, updatedBook) {
                    if (err) throw(err);
                    console.log(updatedBook);
                });

                // Creates new sold book in db, default date is current time
                var newSoldbook = new Soldbook({
                    bookID: bookid,
                    buyer: buyer
                });
                Soldbook.createBook(newSoldbook, function(err, soldbook) {
                    if(err) throw err;
                    console.log(soldbook);
                });

                user.bookspurchased = user.bookspurchased.concat([bookid]);
                user.save(function (err, updatedUser){
                    if (err) throw(err);
                    console.log(updatedUser);
                });
                console.log(user);

            });
        });
        user.cart = [];
        user.save(function (err, updatedUser){
            if (err) throw(err);
            console.log(updatedUser);
        });
        console.log(user);
    });
    return next();
}

// GET User profile
router.get('/profile/:userid', function(req, res, next){
    var userId = req.params.userid;
   User.findById(userId, function(err, user){
       console.log(user);
       if (err || user == null){
           res.render('error', {
               title: 'UW Textbooks',
               message: 'User does not exist'
           })
       } else {
           Book.find({username: user.username}).populate('setbookID').exec(function(err, books){
               Rating.find({receiver: userId}).populate('sender').exec(function(err, ratings){
                   res.render('profile', {
                       title: 'UW Textbooks',
                       username: user.username,
                       books: books,
                       ratings: ratings,
                       avatarURL: 'https://conferencecloud-assets.s3.amazonaws.com/default_avatar.png',
                       userId: userId
                   })
               })
           })
       }
   })
});

// GET User settings
router.get('/settings', ensureAuthenticated, function(req, res, next) {
    res.render('settings', {
        title: 'UW Textbooks',
        errors: false
    })
});

// POST user password change
router.post('/settings/changepass', ensureAuthenticated, function(req, res, next) {
    var email = req.body.email;
    var password = req.body.password;
    var newpass = req.body.newpass;
    var newpass2 = req.body.newpass2;

    req.checkBody('email', 'Email is required').notEmpty();
    req.checkBody('password', 'Current password is required').notEmpty();
    req.checkBody('newpass', 'New password is required').notEmpty();
    req.checkBody('newpass2', 'New passwords do not match. Please try again.').equals(req.body.newpass);
    req.checkBody('email', 'Email is incorrect. Please try again.').equals(req.user.email);

    var errors = req.validationErrors();

    User.getUserByUsername(req.user.username, function(err, user){
        if (errors){
            res.render('settings', {
                title: 'UW Textbooks',
                errors: errors
            })
        }
        else { 
            User.comparePassword(password, user.password, function(err, isMatch){
                if(err) throw err;
                if(isMatch){
                    User.changePassword(user.username, newpass, function(err, user){
                        if(err) throw err;
                        console.log(user);
                    });

                    req.flash('success_msg', 'You successfully changed your password. Please login again.');

                    req.logout();
                    res.redirect('/users/login');
                } else {
                    console.log("lol");

                    req.flash('error_msg', 'Password incorrect. Please try again.');
                    res.redirect('/users/settings');
                }
            });
        }
    })
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
