const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const { listingSchema, reviewSchema } = require("./SchemaValidate/schema.js");
const Review = require("./models/review.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

async function main() {
  await mongoose.connect(MONGO_URL);
}

main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "public")));

// app.use("/api",(req,res,next)=>{
//  let token = req.query;
//  if(token=="giveaccess"){
//   next();
//  }else{
//   res.send("access denied");
//  }
// });

// app.use("/api/:token", (req, res) => {
//   let {token}=req.params;
//   if(token==="giveaccess"){
//     return res.send("access authorized");
//   }else{
//     return res.send("access unauthorized");
//   }

// });

// app.use("/api",(req,res)=>{

//   let {token} = req.query;

//   if(token==="giveaccess"){
//     return res.send("access authorized");
//   }else{
//     return res.send("access unauthorized");
//   }

// });

// const checkToken=(req,res)=>{

//   let {token} = req.query;

//   if(token==="giveaccess"){
//     return res.send("access authorized");
//   }else{
//      throw new Error("access unauthorized");
//   }

// };

// app.use("/err", (req, res) => {
//   abc = abc;
//   // res.send("data");
// });

// app.use((err, req, res, next) => {
//   console.log("-------------error----------");
//   next(err);
// });

// app.use("/api",(req, res, next) => {
//   console.log("middle ware 1");
//   next();
// });

// app.use(() => {
//   console.log("middle ware 2");
// });

app.get("/", (req, res) => {
  res.send("hi i am root");
});

const validateListing = (req, res, next) => {
  let result = listingSchema.validate(req.body);
  if (result.error) {
    let allMsg = result.error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, allMsg);
  } else {
    next();
  }
};

const validateReview = (req, res, next) => {
  let result = reviewSchema.validate(req.body);
  if (result.error) {
    let allMsg = result.error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, allMsg);
  } else {
    next();
  }
};

// app.get("/testListing", async (req, res) => {
//   let sampleListing = new Listing({
//     title: "Goa Vila",
//     description: "On The Bearch",
//     price: 1200,
//     location: "Goa",
//     country: "India",
//   });
//   await sampleListing.save();
//   console.log("sample was saved");
//   res.send("successful");
// });

app.get(
  "/listings",
  wrapAsync(async (req, res) => {
    const allListing = await Listing.find({});
    res.render("listings/index.ejs", { allListing });
  }),
);

app.get(
  "/listing/new",
  wrapAsync(async (req, res) => {
    res.render("listings/new.ejs");
  }),
);

// CREATE
app.post(
  "/listing",
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
app.get(
  "/listings/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    console.log(id);
    const listing = await Listing.findById(id).populate("reviews");
    console.log(listing);
    res.render("listings/show.ejs", { listing });
  }),
);

// edit route
app.get(
  "/listings/:id/edit",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    console.log(id);
    const listing = await Listing.findById(id);
    console.log(listing);
    res.render("listings/edit.ejs", { listing });
  }),
);

// update route
app.put(
  "/listings/:id/update",
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
app.delete(
  "/listings/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    console.log(id);
    deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    res.redirect("/listings");
  }),
);


// reviews route
// post route
app.post("/listing/:id/reviews",validateReview, wrapAsync( async (req, res) => {
  let listing = await Listing.findById(req.params.id);
  let newReview = new Review(req.body.review);
  listing.reviews.push(newReview);
  await newReview.save();
  await listing.save();
  console.log("new review saved !!");
  res.redirect(`/listings/${listing._id}`);
}));

// delete review route
app.delete("/listings/:id/reviews/:reviewId",wrapAsync(async(req,res)=>{
  let {id,reviewId} = req.params;
  await Listing.findByIdAndUpdate(id ,{$pull :{reviews:reviewId}});
  await Review.findByIdAndDelete(reviewId);
  res.redirect(`/listings/${id}`);
}));


// app.all(/(.*)/, (req, res, next) => {
//   next(new ExpressError(404, "Page not Found"));
// });

// handle error middleware
app.use((err, req, res, next) => {
  let { status = 500, message = "Internal Server Error" } = err;
  console.log(err);
  res.render("error.ejs", { status, message });
  // res.status(statusCode).send(message);
  // res.send("ERROR OCCURED!");
});

app.listen(8080, () => {
  console.log("server is listening to 8080");
});
