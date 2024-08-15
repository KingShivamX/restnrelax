// requiring Environment Variables
if (process.env.NODE_ENV != "production") {
    require("dotenv").config();
};
// requiring packages
const express = require("express");
const ejsMate = require("ejs-mate");
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const Listing = require("./models/listing.js");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const Joi = require("joi");
const { listingSchema, reviewSchema } = require("./utils/schemaValidate.js");
const Review = require("./models/review.js");
const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const passport = require("passport");
const LocalStatergy = require("passport-local");
const passportLocalMongoose = require("passport-local-mongoose");
const User = require("./models/user.js");
const userRouter = require("./routes/user.js");
const { loginCheck, saveRedirectUrl } = require("./utils/middleware.js");
const { ownerCheck, authorCheck } = require("./utils/middleware.js");
const { validateListing, validateReview } = require("./utils/middleware.js");
const listingController = require("./controllers/listing.js");
const reviewController = require("./controllers/reviews.js");
const userController = require("./controllers/user.js");
const multer = require("multer");
const geocodingClient = require('@mapbox/mapbox-sdk/services/geocoding');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');

///////////////////////////////////////////////////////////////
// express options
const app = express();
const port = 3000;

// mongo atlas url
const dburl = process.env.ATLASDB_URL;

// mongoStore to store session
const store = MongoStore.create({
    mongoUrl: dburl, // will be saved in this database (atlas)
    crypto: { // to encrypt secret, we use crypto.
        secret: process.env.SECRET,
    },
    touchAfter: 24 * 3600, // in seconds, session update after 24 hours.
}); // this information should be passed in session

store.on("error", () => {
    console.log("ERROR in MONGO SESSION STORE", err)
}); // if error

// session options
const sessionOptions = {
    store: store, // the session infromation will be saved in our db store.
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    }
};

///////////////////////////////////////////////////////////////
// folders and metods setup middlewares.
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));
app.use(express.static(path.join(__dirname, "/public")));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate); // this does the work of Includes in EJS.
app.use(session(sessionOptions)); // express session manager.
app.use(flash()); // using before routes, to use flash messages.

////// passport middlewares
// passport uses session, so we use passtort after session middleware.
app.use(passport.initialize()); // we need to inatialize before using passport.
app.use(passport.session()); // req uses same session for diffrent page to page.

// use static authenticate method of model-"User" in LocalStrategy.
passport.use(new LocalStatergy(User.authenticate()));
// statergy we are using here is LocalStatergy, it will authenticate all the users
// and in User model, authenticate() method will be used to authenticate.

// use static serialize and deserialize of model-"User" for passport session support
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
// serializeUser will store user information in session.
// deserializeUser will remove user information after session expires.

////// flash middlewares
app.use((req, res, next) => {
    res.locals.successMsg = req.flash("success");
    // this successMsg is array having success value in string.
    res.locals.errorMsg = req.flash("error");
    res.locals.currentUser = req.user; // storing current session user.
    // console.log(res.locals.currentUser);
    next();
});

///////////////////////////////////////////////////////////////
//////////////// RESTful API's
// home
app.get("/", (req, res) => {
    res.redirect("/listing");
});

// using express router middleware
app.use("/listing", listingRouter);
// we will use that listing we required, for all the requests at /listing
// this /listing which is common in all is called parent route.

app.use("/listing/:id/review", reviewRouter);
// for all requests at .../reviews
// here :id is remained in app.js file, it will not pass in review.js file by default.

app.use("/", userRouter);
// to manage signup signin.e
// no parent route, because no common api.

///////////////////////////////////////////////////////////////
// error handling middlewares at last.

// standard page not found response
app.all("*", (req, res, next) => {
    next(new ExpressError(404, "Page Not Found!"));
});

// middleware to handelk error
app.use((err, req, res, next) => {
    let { status = 500, message = "Something Went Wrong" } = err;
    // console.log(err.stack) // that whole info where error started.
    // console.log("=>", err.message, "=>", err.status, "=>", err.name);
    res.status(status).render("./listings/error.ejs", { err });
});

///////////////////////////////////////////////////////////////
///////////////////// mongoDB live listening setup
async function main() {
    // await mongoose.connect("mongodb://127.0.0.1:27017/restnrelax"); // localhost
    await mongoose.connect(dburl); // atlas cloud db.
};
main()
    .then((res) => console.log("Connected Established"))
    .catch((err) => console.log(err));

///////////////////////////////////////////////////////////////
///////////////////// express live listning setup
app.listen(port, () => {
    console.log(`Port is Listening at: ${port}`);
});

///////////////////////////////////////////////////////////////