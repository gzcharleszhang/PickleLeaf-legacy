var mongoose = require('mongoose');
var Book = require('./book');
var Schema = mongoose.Schema;


// Soldbook Schema
var SoldbookSchema = mongoose.Schema({
    bookID: {
        type: Schema.Types.ObjectId,
        ref: "Book"
    },
    buyer: {
        type: String
    },
    date: {
        type: Date,
        default: Date.now
    }
});

var Soldbook = module.exports = mongoose.model('Soldbook', SoldbookSchema);

// CreateBook function saves a sold textbook into db
module.exports.createBook = function(newSoldbook, callback){
    newSoldbook.save(callback);
};