var mongoose = require('mongoose');
var User = require('./user');
var Schema = mongoose.Schema;


// Message Schema
var MessageSchema = mongoose.Schema({
    title: {
        type: String
    },
    content: {
        type: String
    },
    sender: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    receiver: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    read: {
        type: Boolean
    },
    date: {
        type: Date,
        default: Date.now
    }
});

var Message = module.exports = mongoose.model('Message', MessageSchema);

// CreateBook function saves a textbook into db
module.exports.createMessage = function(newMessage, callback){
    newMessage.save(callback);
};