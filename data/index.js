const mongoose = require("mongoose");
const init = require("./data.js");
const Listing = require("../models/listing.js");

const main = async () => {
    await mongoose.connect("<clod database will be connected>");
}
main()
.then(()=>console.log("connection succesful"))
.catch((err)=>console.log(err)); 

const initData = async () => {
    // await Listing.deleteMany({});
    init.data = init.data.map((obj) => ({...obj, owner: "<owener will be auto selected>"}))
    // adding the new owner: objectID, for all the objects in init.data
    await Listing.insertMany(init.data);
};

initData()
.then(()=>console.log("Data Was Inatialised"));