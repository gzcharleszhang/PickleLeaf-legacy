var mongoose = require('mongoose');

// Book Schema
var BookSchema = mongoose.Schema({
    username: {
        type: String,
        index:true
    },
    title: {
        type: String
    },
    author: {
        type: String
    },
    course: {
        type: String
    },
    price: {
        type: String
    },
    description: {
        type: String
    },
    sold: {
        type: Boolean
    }
});

var Book = module.exports = mongoose.model('Book', BookSchema);

// CreateBook function saves a textbook into db
module.exports.createBook = function(newBook, callback){
    newBook.save(callback);
};