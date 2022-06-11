const express = require("express");
const router = express.Router();
const expenses = require("../controllers/expenses") //represents controller
const catchAsync = require("../utils/catchAsync");// require the function that will execute our functions and catch errors
const Expenses = require("../models/expenses"); //require the model
const {isLoggedIn, isEmployee, validateExpense} = require("../middleware")//require the middleware to check if user is logged in 
const multer = require("multer") //require multer which allows uploading and parsing images
const {storage} = require("../cloudinary");//require the storage
const upload = multer({storage}) //using multer upload to cloudinary

//router.route to handle all verb requests on /
//different requests
router.route("/")
    //display all expenses
    .get(isLoggedIn, catchAsync(expenses.index))
    //post request to submit new expense
    .post(isLoggedIn, 
        upload.array("receipt"), 
        validateExpense, 
        catchAsync(expenses.createExpense))
   

//bring up the new expense page
router.get("/new", isLoggedIn, expenses.newForm)

//router.route to handle all verb requests on /:id
router.route("/:id")
    //get individual expense route
    .get(isLoggedIn, catchAsync(expenses.showExpense))
    //update the individual expense route
    .put(isEmployee, isLoggedIn, upload.array("receipt"), validateExpense, catchAsync(expenses.updateExpense))
    //delete individual expense route
    .delete(isLoggedIn, isEmployee, catchAsync(expenses.deleteExpense))

//get the edit individual expenses page
router.get("/:id/edit", isEmployee, isLoggedIn, catchAsync(expenses.editForm))

module.exports = router; 