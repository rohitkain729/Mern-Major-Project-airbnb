const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveRediretUrl } = require("../middleware.js");
const userController = require("../controllers/user.js");

router.get("/signup", userController.renderSignupForm);

router.get("/login",userController.renderLoginForm);

// login
router.post(
  "/login",
  saveRediretUrl,
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),

  userController.login,
);
// logout
router.get("/logout", userController.logout);

router.post(
  "/signup",
  wrapAsync(userController.signup),
);

module.exports = router;
