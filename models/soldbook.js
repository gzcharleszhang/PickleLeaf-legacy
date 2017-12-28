var mongoose = require('mongoose');
var Setbook = require('./setbook');
var Schema = mongoose.Schema;


// Soldbook Schema
var SoldbookSchema = mongoose.Schema({
    setbookID: {
        type: Schema.Types.ObjectId,
        ref: "Setbook"
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