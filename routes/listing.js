const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const { listingSchema, reviewSchema } = require("../SchemaValidate/schema.js");
const ExpressError = require("../utils/ExpressError.js");
const Listing = require("../models/listing.js");
const { isLoggedIn,isOwner,validateListing} = require("../middleware.js");



router.get(
  "/",
  wrapAsync(async (req, res) => {
    const allListing = await Listing.find({});
    res.render("listings/index.ejs", { allListing });
  }),
);

// new route
router.get(
  "/new",
  isLoggedIn,
  wrapAsync(async (req, res) => {
    res.render("listings/new.ejs");
  }),
);

// CREATE
router.post(
  "/",
  isLoggedIn,
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
    newListing.owner = req.user._id;
    await newListing.save();
    req.flash("success", "New Listing Created!");
    res.redirect("/listings");
  }),
);

// find by id show route
router.get(
  "/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    console.log(id);
    const listing = await Listing.findById(id)
      .populate({path:"reviews",populate:{
        path:"author",
      },})
      .populate("owner");
    
      if (!listing) {
      req.flash("error", "Listing Doesn't Exists !");
      res.redirect("/listings");
    }
    console.log(listing);
    res.render("listings/show.ejs", { listing });
  }),
);

// edit route
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    console.log(id);
    const listing = await Listing.findById(id);
    if (!listing) {
      req.flash("error", "Listing Doesn't Exists !");
      res.redirect("/listings");
    }
    res.render("listings/edit.ejs", { listing });
  }),
);

// update route
router.put(
  "/:id/update",
  isLoggedIn,
  isOwner,
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
    req.flash("success", "Listing Updated Successfully !");
    res.redirect(`/listings/${id}`);
  }),
);

//delete route
router.delete(
  "/:id",
  isLoggedIn,
  isOwner,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    console.log(id);
    deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success", "Successfully Deleted Listing !");
    res.redirect("/listings");
  }),
);

module.exports = router;
