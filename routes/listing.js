const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const { listingSchema, reviewSchema } = require("../SchemaValidate/schema.js");
const ExpressError = require("../utils/ExpressError.js");
const Listing = require("../models/listing.js");


const validateListing = (req, res, next) => {
  let result = listingSchema.validate(req.body);
  if (result.error) {
    let allMsg = result.error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, allMsg);
  } else {
    next();
  }
};

router.get(
  "/",
  wrapAsync(async (req, res) => {
    const allListing = await Listing.find({});
    res.render("listings/index.ejs", { allListing });
  }),
);

router.get(
  "/new",
  wrapAsync(async (req, res) => {
    res.render("listings/new.ejs");
  }),
);

// CREATE
router.post(
  "/",
  validateListing,
  wrapAsync(async (req, res, next) => {
    // let {title,description,price,image,price,country.location}=req.body;

    // if(!req.body.listing){
    //   throw new ExpressError(400,"send valid Listing data");
    // }

    let listing = req.body.listing;
    const newListing = new Listing(listing);

    // if(!newListing.description){
    //   throw new ExpressError(500,"Description Field is Required");
    // }
    // if(!newListing.title){
    //   throw new ExpressError(500,"Title Field is Required");
    // }
    // if(!newListing.price){
    //   throw new ExpressError(500,"Price Field is Required");
    // }
    // if(!newListing.Country){
    //   throw new ExpressError(500,"Country Field is Required");
    // }

    // newListing.image.url = listing.image.url;
    await newListing.save();
    res.redirect("/listings");
  }),
);

// find by id
router.get(
  "/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    console.log(id);
    const listing = await Listing.findById(id).populate("reviews");
    console.log(listing);
    res.render("listings/show.ejs", { listing });
  }),
);

// edit route
router.get(
  "/:id/edit",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    console.log(id);
    const listing = await Listing.findById(id);
    console.log(listing);
    res.render("listings/edit.ejs", { listing });
  }),
);

// update route
router.put(
  "/:id/update",
  validateListing,
  wrapAsync(async (req, res) => {
    if (!req.body.listing) {
      throw new ExpressError(400, "send valid Listing data");
    }
    let { id } = req.params;
    console.log(id);
    let updateListing = req.body.listing;
    console.log(updateListing);
    await Listing.findByIdAndUpdate(id, { ...updateListing });
    res.redirect("/listings");
  }),
);

//delete route
router.delete(
  "/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    console.log(id);
    deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    res.redirect("/listings");
  }),
);



module.exports = router;
