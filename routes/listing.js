const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const { listingSchema, reviewSchema } = require("../SchemaValidate/schema.js");
const ExpressError = require("../utils/ExpressError.js");
const Listing = require("../models/listing.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const listingController = require("../controllers/listings.js");

router
  .route("/")
  .get(wrapAsync(listingController.index))
  .post(isLoggedIn, validateListing,wrapAsync(listingController.createListing));




// router.get("/", wrapAsync(listingController.index));

// new route
router.get("/new", isLoggedIn, wrapAsync(listingController.renderNewForm));

// CREATE
// router.post(
//   "/",
//   isLoggedIn,
//   validateListing,
//   wrapAsync(listingController.createListing),
// );

router.route("/:id")
.get(wrapAsync(listingController.showListing))
.delete(isLoggedIn,isOwner,wrapAsync(listingController.destroyListing)
);

// find by id show route
// router.get("/:id", wrapAsync(listingController.showListing));




// edit route
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.renderEditForm),
);

// update route
router.put(
  "/:id/update",
  isLoggedIn,
  isOwner,
  validateListing,
  wrapAsync(listingController.updateListing),
);

//delete route
// router.delete(
//   "/:id",
//   isLoggedIn,
//   isOwner,
//   wrapAsync(listingController.destroyListing),
// );

module.exports = router;
