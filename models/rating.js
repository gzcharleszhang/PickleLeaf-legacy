var mongoose = require('mongoose');
var User = require('./user');
var Schema = mongoose.Schema;

// Rating Schema
var RatingSchema = mongoose.Schema({
    comment: {
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
    score: {
        type: Number
    },
    date: {
        type: Date,
        default: Date.now
    }
});

var Rating = module.exports = mongoose.model('Rating', RatingSchema);

// CreateBook function saves a rating into db
module.exports.createRating = function(newRating, callback){
    newRating.save(callback);
};