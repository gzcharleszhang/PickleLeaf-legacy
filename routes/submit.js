var express = require('express');
var router = express.Router();

/* GET submission page */
router.get('/', function(req, res, next){
    res.render('submit', { title: 'UW Textbooks' });
});

/* POST book submission */
router.post('/', function(req, res, next){
    res.redirect('/submitted/' + req.body.bookid)
});
module.exports = router;
