const express = require("express");
const router = express.Router(); 
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveRedirectUrl } = require("../utils/middleware.js");
const controller = require("../controllers/user.js");
const multer = require("multer");
const {storage} = require("../cloudConfig.js");
// cloud Storage.
const upload = multer({ storage });
// it will se saved to direct cloud storage.

// // //////////////////////////////////////////////////////////////
// using router.route, to group together routes of same paths.

// router.route "/signup"
router.route("/signup")
.get(controller.renderSignup)
.post(upload.single("profile"), 
    wrapAsync(controller.signup));

// router.route "/login"
router.route("/login")
.get(controller.renderLogin)
.post(saveRedirectUrl,
    passport.authenticate("local", {failureFlash : true, failureRedirect: "/login"}),
    controller.login);

// logout 
router.get("/logout", controller.logout);
 
// // //////////////////////////////////////////////////////////////
//// apis
// signup
// router.get("/signup", controller.renderSignup);
// router.post("/signup", wrapAsync(controller.signup));

// login
// router.get("/login", controller.renderLogin);
// // now here we try to authentcate user, it will be done by middleware.
// // In passport.authenticate(), we pass statergy , and failureRedirect etc.
// // here failureFlash will automatically send the error flash msg.
// router.post("/login",
//     saveRedirectUrl, // saving url before login.
//     passport.authenticate("local", {failureFlash : true, failureRedirect: "/login"}),
//     controller.login
// );

// logout 
// router.get("/logout", controller.logout);

// exporting router.
module.exports = router;