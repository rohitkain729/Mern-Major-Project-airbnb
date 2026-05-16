const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveRediretUrl } = require("../middleware.js");

router.get("/signup", (re, res) => {
  res.render("users/signup.ejs");
});

router.get("/login", (re, res) => {
  res.render("users/login.ejs");
});

// login
router.post(
  "/login",
  saveRediretUrl,
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),

  async (req, res) => {
    req.flash("success", "Welcome back to Wanderlust!");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
  },
);
// logout
router.get("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.flash("success", "Successfully logout !");
    res.redirect("/listings");
  });
});

router.post(
  "/signup",
  wrapAsync(async (req, res) => {
    try {
      let { username, email, password } = req.body;
      const newUser = new User({ email, username });
      const registeredUser = await User.register(newUser, password);

      console.log(registeredUser);
      req.login(registeredUser, (err) => {
        if (err) {
          return next(err);
        }
        req.flash("success", "welcome to WonderLust !");
        res.redirect("/listings");
      });
    } catch (err) {
      req.flash("error", err.message);
      res.redirect("/signup");
    }
  }),
);

module.exports = router;
