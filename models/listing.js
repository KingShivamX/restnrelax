const mongoose = require("mongoose");
const { listingSchema } = require("../utils/schemaValidate");
const Schema = mongoose.Schema;
const defaultImage = "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjB8fGhvdGVsc3xlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60";

const Review = require("./review.js");
const { required } = require("joi");

const ListingSchema = new Schema({
    title:{
        type: String,
        required: true,
    },
    description: {
        type: String,
        default: "Hotel",
    },
    image: {
        url: {
            type: String,
            default: defaultImage,
        },
        filename: {
            type: String,
            default: "Image"
        }
        // type: String,
        // default: defaultImage,
        // set: (v) => v === "" ? defaultImage : v ,
        // // this v is the link sent by user.
        // // if image comes and is empty sting then default is set.
    },
    price:{
        type: Number,
        required: true,
    },
    location: {
        type: String,
        require: true,
    },
    country: {
        type: String,
        default: "India",
    },
    review: [
        {
            type: Schema.Types.ObjectId, 
            ref: "Review",
            // storing review objects in array, one to many DB relationship.
        }
    ],
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User", 
        // storing user objectID as owner.
    },
    // geoJSON format, which we will get through mapbox
    geometry: {
        type: {
            type: String,
            enum: ["Point"],
            required: true,
        },
        coordinates : {
            type: [Number],
            required: true,
        },
    },
});

// if listing deleted , then delete all that review,
// creating post middleware before model creation.
ListingSchema.post("findOneAndDelete", async(listing)=> {
    if(listing) {
        await Review.deleteMany({_id: {$in: listing.review}});
    }
});

const Listing = mongoose.model("Listing", ListingSchema);
module.exports = Listing;