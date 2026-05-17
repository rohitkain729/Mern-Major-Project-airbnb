const Listing = require("../models/listing");

module.exports.index = async (req, res) => {
  const allListing = await Listing.find({});
  res.render("listings/index.ejs", { allListing });
};

module.exports.renderNewForm = async (req, res) => {
  res.render("listings/new.ejs");
};

module.exports.showListing = async (req, res) => {
  let { id } = req.params;
  console.log(id);
  const listing = await Listing.findById(id)
    .populate({
      path: "reviews",
      populate: {
        path: "author",
      },
    })
    .populate("owner");

  if (!listing) {
    req.flash("error", "Listing Doesn't Exists !");
    res.redirect("/listings");
  }
  console.log(listing);
  res.render("listings/show.ejs", { listing });
};


module.exports.createListing = async (req, res, next) => {
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
  };


  module.exports.renderEditForm = async (req, res) => {
      let { id } = req.params;
      console.log(id);
      const listing = await Listing.findById(id);
      if (!listing) {
        req.flash("error", "Listing Doesn't Exists !");
        res.redirect("/listings");
      }
      res.render("listings/edit.ejs", { listing });
    };


    module.exports.updateListing=async (req, res) => {
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
      };


    module.exports.destroyListing = async (req, res) => {
    let { id } = req.params;
    console.log(id);
    deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success", "Successfully Deleted Listing !");
    res.redirect("/listings");
  };