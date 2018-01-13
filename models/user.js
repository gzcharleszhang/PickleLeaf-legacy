var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
var Book = require('./book');
var Schema = mongoose.Schema;

// User Schema
var UserSchema = mongoose.Schema({
    username: {
        type: String,
        index:true
    },
    password: {
        type: String
    },
    email: {
        type: String
    },
    name: {
        type: String
    },
    booksown: [{
        type: Schema.Types.ObjectId,
        ref: "Book"
    }],
    bookspurchased: [{
        type: Schema.Types.ObjectId,
        ref: "Book"
    }],
    cart: [{
        type: Schema.Types.ObjectId,
        ref: "Book"
    }]
});

var User = module.exports = mongoose.model('User', UserSchema);

module.exports.createUser = function(newUser, callback){
    bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(newUser.password, salt, function(err, hash) {
            newUser.password = hash;
            newUser.save(callback);
        });
    });
};

module.exports.getUserByUsername = function(username, callback){
    var query = {username: username};
    User.findOne(query, callback);
};

module.exports.getUserById = function(id, callback){
    User.findById(id, callback);
};

module.exports.changePassword = function(username, password, callback){
    User.getUserByUsername(username, function(err, user) {
        bcrypt.genSalt(10, function(err, salt) {
            bcrypt.hash(password, salt, function(err, hash) {
                user.password = hash;
                user.save(callback);
            });
        });
    })
};

module.exports.comparePassword = function(candidatePassword, hash, callback){
    bcrypt.compare(candidatePassword, hash, function(err, isMatch) {
        if(err) throw err;
        callback(null, isMatch);
    });
};