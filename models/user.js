const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const model = mongoose.model;
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
    },
});

// passport-local-mongoose, will automaticaly add a 'username' and 'password' for us.
// it will automitaclly do hashing salting etc, And will add some Methods we can use.
// to do that, we need to add a plugin after creation of Schema.
userSchema.plugin(passportLocalMongoose) // which we required.

module.exports = model("User", userSchema); 
// exporting, will require with model name "User".