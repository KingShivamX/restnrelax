const { required } = require("joi");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const model = mongoose.model;
const passportLocalMongoose = require("passport-local-mongoose");
const defaultProfile = "https://img.freepik.com/premium-vector/default-avatar-profile-icon-social-media-user-image-gray-avatar-icon-blank-profile-silhouette-vector-illustration_561158-3383.jpg"

const userSchema = new Schema({
    name: {
        type: String,
        required: true,
        maxlength: 30,
    },
    email: {
        type: String,
        required: true,
        maxlength: 30,
    },
    profile: {
        url: {
            type: String,
            default: defaultProfile,
        },
        filename: {
            type: String,
            default: "Image"
        },
    },
});

// passport-local-mongoose, will automaticaly add a 'username' and 'password' for us.
// it will automitaclly do hashing salting etc, And will add some Methods we can use.
// to do that, we need to add a plugin after creation of Schema.
userSchema.plugin(passportLocalMongoose) // which we required.

module.exports = model("User", userSchema); 
// exporting, will require with model name "User".