var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

var userSchema = new mongoose.Schema({
    username: String,
    password: String,
    avatar: {type: String, default: 'http://cdn.onlinewebfonts.com/svg/img_383214.png'},
    firstName: {type: String, default: 'N/A'},
    lastName: {type: String, default: 'N/A'},
    bio: {type: String, default: 'N/A'}
})

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema)