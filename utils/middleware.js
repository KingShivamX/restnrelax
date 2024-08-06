const Listing = require("../models/listing.js");
const Review = require("../models/review.js");
const ExpressError = require("../utils/ExpressError.js");
const { listingSchema, reviewSchema } = require("../utils/schemaValidate.js");

/////////////////////////////////////////////////////////////////////////////////////
// middleware to check if user is loggined or not.
// this line is exporting an object with functions inside it.
module.exports.loginCheck = (req, res, next) => {
    if(!req.isAuthenticated()) { 
        // console.log(req.originalUrl);
        // we want to redirect user, after login to the page he was trying to access.
        // req.originalUrl is the actual url, user tried to access when this fn triggered.
        // creating a redirectUrl in session object, storing req.originalUrl.
        req.session.redirectUrl = req.originalUrl; 
        // this will only be saved if loginCheck is triggered.

        req.flash("error", "You are not logged in!");
        return res.redirect("/login");
    };
    next(); // if user is authenticated.
};
// passport resets req.session after a succesfull login.
// so we need to store that redirectUrl in locals variable.

// creating a middleware function which will store redirectUrl before login.
module.exports.saveRedirectUrl = (req, res, next)=>{
    if(req.session.redirectUrl){ // if anything is saved
        res.locals.redirectUrl = req.session.redirectUrl;
        // if login check triggered, then the path will be saved in locals.
        // 'res.locals.redirectUrl' will be undefined if loginCheck is not triggered.
    }
    next();
};



/////////////////////////////////////////////////////////////////////////////////////
// middleware to check if owner is authorized to edit/delete listing etc.
module.exports.ownerCheck = async(req, res, next) => {
    let { id } = req.params

    // authorization, if listing owner is trying to edit or somwone else is.
    let listing = await Listing.findById(id);
    // equals() compares ObjectIds in mongoDB.
    if(res.locals.currentUser && !listing.owner._id.equals(res.locals.currentUser._id)) {
        req.flash("error", "Your not the owner of this listing!");
        return res.redirect(`/listing/${id}`);
    }
    next();
};

// middleware to check if author is authorized to edit/delete review etc.
module.exports.authorCheck = async(req, res, next) => {
    let { id, reviewId } = req.params
    let review = await Review.findById(reviewId);
    if(!review.author._id.equals(res.locals.currentUser._id)) {
        req.flash("error", "Your not the author of this review!");
        return res.redirect(`/listing/${id}`);
    }
    next();
};

/////////////////////////////////////////////////////////////////////////////////////
// middleware to validate listing schema.
// Validate Listing Function, (we will pass this as a middleware)
module.exports.validateListing = (req, res, next)=> {
    let {error} = listingSchema.validate(req.body);
    if(error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
};

// middleware to validate review schema.
// Validate Review Function
module.exports.validateReview = (req, res, next)=> {
    let {error} = reviewSchema.validate(req.body);
    if(error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
};
/////////////////////////////////////////////////////////////////////////////////////