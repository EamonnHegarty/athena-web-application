const express = require("express");
const router = express.Router();
const passport = require("passport");
const catchAsync = require("../utils/catchAsync");
const User = require("../models/user");
const users = require("../controllers/users")

//router.route to handle all verb requests on /register
router.route("/register")
    //get the registration form
    .get(users.renderRegister)
    //post the new registration route
    .post(catchAsync(users.register))
    
//router.route to handle all verb requests on /login
router.route("/login")
    //get the login page route
    .get(users.renderLogin)
    //post the log in form and usse passport middleware for login failures
    .post(passport.authenticate("local", {failureFlash: true, failureRedirect: "/login"}), users.login)

//log out route
router.get("/logout", users.logout)

module.exports = router;