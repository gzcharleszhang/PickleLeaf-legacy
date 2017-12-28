var mongoose = require('mongoose');
var Setbook = require('./setbook');
var Schema = mongoose.Schema;


// Soldbook Schema
var SoldbookSchema = mongoose.Schema({
    username: {
        type: String,
        index:true
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