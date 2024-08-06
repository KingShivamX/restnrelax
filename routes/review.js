const express = require("express");
const router = express.Router({ mergeParams: true}); 
// to get req.body.params in child route from parent route.
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const Review = require("../models/review.js");
const { validateReview, loginCheck, authorCheck, saveRedirectUrl } = require("../utils/middleware.js");
const controller = require("../controllers/reviews.js");

// /////////////////////////////////////////////////////////////////
// shifted all review routes from app.js to review.js => 

// APIs
// to create reviews
router.post("/", 
    saveRedirectUrl,
    loginCheck, 
    validateReview,
    wrapAsync(controller.createReview));

// delete review route by deleting review
router.delete("/:reviewId", 
    loginCheck,
    authorCheck,
    wrapAsync(controller.destroyReview)); 

// exporting router.
module.exports = router;