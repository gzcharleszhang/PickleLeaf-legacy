var express = require('express');
var router = express.Router();
var Book = require('../models/book');
var Setbook = require('../models/setbook');
var User = require('../models/user');
var Message = require('../models/message');


router.get('/', function(req, res, next){
    var userId = req.user._id;

    Message.find({receiver: userId}).populate('sender').exec(function (err, messages_received){
        if (err) throw err;
        Message.find({sender: userID}).populate('receiver').exec(function (err, messages_sent){
            if (err) throw err;

            res.render('messages', {
                title: 'Pickle Leaf',
                messages_received: messages_received,
                messages_sent: messages_sent
            })
        })
    })
});


module.exports = router;