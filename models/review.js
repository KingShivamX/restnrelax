const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const model = mongoose.model;

const reviewSchema = new Schema({
    comment: {
        type: String,
    },
    rating : {
        type: Number,
        min: 1,
        max: 5,
    },
    created: {
        type: Date,
        default: Date.now(), 
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: "User",
        // storing user objectID as owner/author of review.
    },
})

module.exports = model("Review", reviewSchema);
// we will import it with , "Review" name.