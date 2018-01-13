var mongoose = require('mongoose');
var Setbook = require('./setbook');
var User = require('./user');
var Schema = mongoose.Schema;


// Book Schema
var BookSchema = mongoose.Schema({
    sellerID: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    price: {
        type: Number
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
    },
    date: {
        type: Date,
        default: Date.now
    }
});

var Book = module.exports = mongoose.model('Book', BookSchema);

// CreateBook function saves a textbook into db
module.exports.createBook = function(newBook, callback){
    newBook.save(callback);
};