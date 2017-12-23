var express = require('express');
var router = express.Router();

/* GET register page*/
router.get('/register', function(req, res, next) {
    res.render('register', { title: 'UW Textbooks', success: req.session.success, errors: req.session.errors });
    req.session.errors = null;
});

/* POST user registration */
router.post('/register', function(req, res, next) {
    var user = {
        email: req.body.email,
        password: req.body.password
    }
    req.check('email', 'Invalid email address').isEmail();
    req.check('password', 'Password is invalid').isLength({min: 4});
    req.check('password', 'Passwords do not match').equals(req.body.confirmPassword);

    var errors = req.validationErrors();
    if (errors) {
        req.session.errors = errors;
        req.session.success = false;
    } else {
        req.session.success = true;
    }
    res.redirect('/users/register');
});
module.exports = router;
