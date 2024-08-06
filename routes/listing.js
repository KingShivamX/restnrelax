const express = require("express");
const router = express.Router(); //  getting express router.
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const { loginCheck, ownerCheck, validateListing } = require("../utils/middleware.js");
// destructuring the function loginCheck which is exported from that file.
const controller = require("../controllers/listing.js");
const multer = require("multer");
const {storage} = require("../cloudConfig.js");
// cloud Storage.
const upload = multer({ storage });
// it will se saved to direct cloud storage.

// /////////////////////////////////////////////////////////////////
// shifted all routes from app.js to specific routes folder => 
// here we will use router not app, and will export router.
// /listing is not written here in path, rest of it is written,
// as we have already written "/listing" in middleware as common part.

// // //////////////////////////////////////////////////////////////
// using router.route, to group together routes of same paths.

// router.route "/listing"
router.route("/")
.get(wrapAsync(controller.showAll)) // to show all listings
.post(loginCheck, 
    upload.single("listing[image]"), 
    validateListing, 
    wrapAsync(controller.uploadNew)); // upload new listing in DB.

// shifting up , create new route.
router.get("/new", loginCheck, controller.createNew); // to Create new Listing

// router.route "/listing/:id"
router.route("/:id")
.get(wrapAsync(controller.showListing)) // to show listings in details
.put(loginCheck, ownerCheck, upload.single("listing[image]"), validateListing, wrapAsync(controller.uploadEdited)) // upload edited listing in DB.
.delete(loginCheck, ownerCheck, wrapAsync(controller.destroyListing)); // to delete listing 

// shifting up , to edit listing
router.get("/:id/edit", loginCheck, ownerCheck, wrapAsync(controller.editListing)); // to edit listing

// // //////////////////////////////////////////////////////////////
// APIs
// to show all listings
// router.get("/", wrapAsync(controller.showAll));

// to Create new Listing
// router.get("/new", loginCheck, controller.createNew);   
// upload new listing in DB.
// router.post("/", loginCheck, validateListing, wrapAsync(controller.uploadNew)); 

// to show listings in details
// router.get("/:id", wrapAsync(controller.showListing));

// to edit listing
// router.get("/:id/edit", loginCheck, ownerCheck, wrapAsync(controller.editListing));
// upload edited listing in DB.
// router.put("/:id", loginCheck, ownerCheck, validateListing, wrapAsync(controller.uploadEdited));

// to delete listing 
// router.delete("/:id", loginCheck, ownerCheck, wrapAsync(controller.destroyListing));

// exporting router.
module.exports = router;