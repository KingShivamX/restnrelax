const Listing = require("../models/listing.js");

//////////////// mapbox geocoding setup 
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
// staring service by passing access token.
const geocodingClient = mbxGeocoding({ accessToken: mapToken });


////// ] creating controllers for routes of Listings

// to show all listings
module.exports.showAll = async (req, res)=>{
    const allListing = await Listing.find({});
    res.render("./listings/index.ejs", {allListing});
};

// to Create new Listing
module.exports.createNew = (req, res)=>{
    // console.log(req.user); 
    // essential user information of session is stored in "req.user".

    // this 'isAuthenticated()' method checks if req.user exists or it is undifined.
    // if(!req.isAuthenticated()){// a passport method, sends true if user is authenticated.
    //     req.flash("error", "Login to create Listing!");
    //     return res.redirect("/login");
    // }; // it is better to use this whole codeblock as middleware.

    res.render("./listings/new.ejs")
};

// upload new listing in DB.
module.exports.uploadNew = async (req, res, next)=> {
    // we have recived a object, listing[name] is used in form
    let listing = req.body.listing; 
    // if(!listing) throw new ExpressError(400, "Send Valid Data for Listing") // 400 - bad request.

    // better way validate using joi
    // let result = listingSchema.validate(req.body); // we will validate whole body.
    // console.log(result); // printing result
    // if(result.error) {
    //     throw new ExpressError(404, result.error); // message from joi will be sent.
    // };

    /////// setup to upload image in cloud.
    let url = req.file.path;
    let filename = req.file.filename;

    /////// geocoding setup (forward)
    let response = await geocodingClient.forwardGeocode({
        query: req.body.listing.location,
        limit: 1,
      }).send();

    let newListing = new Listing(listing);
    newListing.owner = req.user; // saving the current user as owner of listing created.  

    newListing.image = { url, filename }; // storing cloud image url and filename.
    
    newListing.geometry =  response.body.features[0].geometry; // storing coordinates of listing

    let savedListing = await newListing.save(); // new Listing saved.

    req.flash("success", "New Listing Created!");
    // we can access this flash msg in local variable of response using key.
    res.redirect("/listing");
};

// to show listings in details
module.exports.showListing = async (req, res)=>{
    let { id } = req.params;
    // we need to do nested population here.
    let listing = await Listing.findById(id)
    .populate({ path: "review", populate: {path:"author"}}).populate("owner");
    if (!listing) { // to show alert flash if listing does not exist.
        req.flash("error", "Listing you requested does not exist!");
        return res.redirect("/listing"); 
        // returning this, so further code will not get executed and so no error.
        // if this res.redirect() sended, further redirect/render/send will throw error.
        // res.status or res.locals are setters they do not send, so they dosent effect.
    };
    // console.log(listing.owner.id)
    res.render("./listings/show.ejs", { listing });
};

// to edit listing
module.exports.editListing = async (req, res)=>{
    let { id } = req.params;
    let listing = await Listing.findById(id);
    if (!listing) { // to show alert flash if listing does not exist.
        req.flash("error", "Listing you requested does not exist!");
        return res.redirect("/listing"); 
        // returning this, so further code will not get executed and so no error.
    };

    // to get in country in dropdown.
    res.locals.orgCountry = listing.country;

    let orgImgUrl = listing.image.url;
    orgImgUrl = orgImgUrl.replace("/upload", "/upload/w_250");
    res.render("./listings/edit.ejs", { listing, orgImgUrl});
};

// upload edited listing in DB
module.exports.uploadEdited = async (req, res) => {
    let { id } = req.params
    // let newListing = {...req.body.listing}; // creadtes new copy
    let newListings = req.body.listing;
    // if(!newListings) throw new ExpressError(400, "Send Valid Data to Update") 

    // // authorization, if listing owner is trying to edit or somwone else.
    // let listing = await Listing.findById(id);
    // // equals() compares ObjectIds in mongoDB.
    // if(!listing.owner._id.equals(res.locals.currentUser._id)) {
    //     req.flash("error", "You don't have permission to edit!")
    //     return res.redirect(`/listing/${id}`);
    // } //// we can pass this whole code as middleware.

    let listing = await Listing.findByIdAndUpdate(id, newListings);
    /////// setup to upload image in cloud.
    if (req.file) {
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = { url , filename }; // storing upgated image url and filename,
        await listing.save();
    };

    req.flash("success", "Listing Updated!");
    res.redirect(`/listing/${id}`);
};

// delete Listing
module.exports.destroyListing = async (req, res)=> {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing Deleted!");
    res.redirect("/listing")
};