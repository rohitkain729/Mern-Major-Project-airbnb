const express = require("express");
const router = express.Router({mergeParams:true});
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const { listingSchema, reviewSchema } = require("../SchemaValidate/schema.js");
const { validateReview, isLoggedIn,isReviewAuthor} = require("../middleware.js");
const reviewContrller = require("../controllers/reviews.js");


// create review route
router.post("/",isLoggedIn,validateReview, wrapAsync(reviewContrller.createReview));

// delete review route
router.delete("/:reviewId",isLoggedIn,isReviewAuthor,wrapAsync(reviewContrller.destroyReview));

module.exports=router;