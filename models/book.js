var mongoose = require('mongoose');
var Setbook = require('../models/setbook');
var Schema = mongoose.Schema;


// Book Schema
var BookSchema = mongoose.Schema({
    username: {
        type: String,
        index:true
    },
    price: {
        type: String
    },
    setbookID: {
        type: Schema.Types.ObjectId,
        ref: "Setbook"
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