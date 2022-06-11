const {expenseSchema} = require("./schemas.js")//desctructer expense schema from schemas
const ExpressError = require("./utils/ExpressError")
const Expenses = require("./models/expenses"); //require the model
 

//middleware to check if logged in
module.exports.isLoggedIn = (req, res, next) => {
    //use passports isAuth method to check if they authenticated
    if(!req.isAuthenticated()){
        req.flash("error", "You must be signed in");
        return res.redirect("/login");
    }
    next();
}

//function to make sure that the data the user enters is valid
module.exports.validateExpense = (req, res, next) => {
    //save the result to destructured error
    const {error} = expenseSchema.validate(req.body)
    if(error){
        //map over the array of error and join to be one message
        const msg = error.details.map(el => el.message).join(",")
        //throw error with customer error handler
        throw new ExpressError(msg, 400)
    }
    //else move on
    else {
        next();
    }
}

//middle ware to ensure manager does not try edit or any outside user
module.exports.isEmployee = async(req, res, next) => {
    const {id} = req.params;
    const expense = await Expenses.findById(id);
    if(!expense.employeeId.equals(req.user._id)){
        req.flash("error", "You do not have permission to do that")
        return res.redirect("/expenses")
    }
    next();
}