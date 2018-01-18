var express = require('express');
var router = express.Router();
var Book = require('../models/book');
var Setbook = require('../models/setbook');
var User = require('../models/user');
var Message = require('../models/message');


router.get('/', ensureAuthenticated, function(req, res, next){
    var userId = req.user._id;

    Message.find({receiver: userId}).sort('-date').populate('sender').exec(function (err, messages_received){
        if (err) throw err;
        Message.find({sender: userId}).sort('-date').populate('receiver').exec(function (err, messages_sent){
            if (err) throw err;

            res.render('messages', {
                title: 'PickleLeaf',
                messages_received: messages_received,
                messages_sent: messages_sent
            })
        })
    })
});


router.get('/submit', ensureAuthenticated, function(req, res, next){

    var recipient_id = req.query.recipient;
    if (recipient_id == null){
        res.render('submit_message', {
            title: 'PickleLeaf',
            errors: [],
            recipient_name: ""
        })
    } else {
        User.findById(recipient_id).exec(function(err, user){
            if (err) {
                res.render('error',{
                    title: 'PickleLeaf',
                    message: 'User does not exist'
                })
            } else {

                res.render('submit_message', {
                    title: 'Pickle Leaf',
                    errors: [],
                    recipient_name: user.username
                })
            }
        });
    }

});


router.post('/submit', function(req, res){
    var receiver_name = req.body.receiver_name;
    var title = req.body.title;
    if (title === ""){
        title = "(no_title)";
    }
    console.log(title);
    var content = req.body.content;
    var sender_id = req.user._id;

    req.checkBody('receiver_name', 'Recipient cannot be empty').notEmpty();
    req.checkBody('content', 'You need to write a message').notEmpty();

    var errors = req.validationErrors();

    if (errors) {
        res.render('submit_message', {
            title: 'PickleLeaf',
            errors: errors,
            recipient_name: ""
        })
    } else {
        User.find({username: receiver_name}, function(err, users){
            if (users.length === 0){
                res.render("error", {
                    title: 'PickleLeaf',
                    message: 'User does not exist'
                })
            } else {
                var user = users[0];
                console.log(user);
                var newMessage = new Message ({
                    title: title,
                    receiver: user._id,
                    sender: sender_id,
                    content: content
                });

                Message.createMessage(newMessage, function(err, msg){
                    console.log(msg);
                });

                res.redirect('/messages');
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