var mongoose = require('mongoose');
var Book = require('./book');

// Book Schema
var SetbookSchema = mongoose.Schema({
    title: {
        type: String,
        index: true
    },
    author: {
        type: String
    },
    course: {
        type: String
    },
    imageURL: {
        type: String
    },
    min_price: {
        type: Number
    },
    books: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Book"
    }]
});

var Setbook = module.exports = mongoose.model('Setbook', SetbookSchema);

// CreateBook function saves a textbook into db
module.exports.createBook = function(newSetbook, callback){
    newSetbook.save(callback);
};
