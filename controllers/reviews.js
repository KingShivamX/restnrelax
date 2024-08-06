const Listing = require("../models/listing");
const Review = require("../models/review");

////// ] creating controllers for routes of Reviews

// delete review route by deleting review
module.exports.createReview = async(req, res,)=>{
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id; // adding user objectID in author.
    listing.review.push(newReview);
    await newReview.save(); // saving review in review.
    await listing.save(); // saving that ID of review object in particular Listing.
    // console.log("new review saved");
    req.flash("success", "New Review Created!");
    res.redirect(`/listing/${listing.id}`);
};

// delete review route by deleting review
module.exports.destroyReview = async(req, res)=>{
    let {id , reviewId} = req.params;
    await Listing.findByIdAndUpdate(id, {$pull: {review: reviewId}});
    // update beacuse, pull operator pulls and delets it from array
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Review Deleted!");
    res.redirect(`/listing/${id}`);
};