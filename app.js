//if we are running in development mode
if(process.env.NODE_ENV !=="production"){
    //require dotenv package and add env variable
    require("dotenv").config();
}

const express = require("express"); //require express
const path = require("path"); //combines requests for a path 
const mongoose = require("mongoose"); //require mongoose
const ejsMate = require("ejs-mate"); // require the boiler plate
const session = require("express-session"); //require express session 
const flash = require("connect-flash"); // require express flash which will be used on session and display success or failure to our users who are on an active session
const ExpressError = require("./utils/ExpressError")//require customer error handler
const methodOverride = require("method-override"); //require method override so we can do put/patch routes
const passport = require("passport"); // requiring passport for authentication
const LocalStrategy = require("passport-local"); // local strategy
const User = require("./models/user") //require the user model


const expenseRoutes = require("./routes/expenses"); //require the express router for expenses
const userRoutes = require("./routes/users");

//connecting to the database
mongoose.connect("mongodb://localhost:27017/employee-expenses", {
    useNewUrlParser: true,  
    useUnifiedTopology: true
})

//checking if mongoose has connected to database
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database Connected");
})

//create the express app
const app = express(); 

app.engine("ejs", ejsMate); //set the engine to ejs to use boiler plate
app.set("view engine", "ejs"); //setting ejs as the view engine
app.set("views"), path.join(__dirname, "views"); //combining any request for views outside of directory

//telling express to parse body when new campground is added
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method")) //to make delete and update routes
app.use(express.static(path.join(__dirname, "public"))) //join requests for outside path requests

//create a session configuration for users
const sessionConfig = {
    //secret to be used in development
    secret: "thisshouldbeabettersecret",
    resave: false,
    saveUninitialized:true,
    //setting some settings for the cookie
    cookie: {
        httpOnly: true, //stop third parties accessing cookie and hacking session
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7, //cookie will expire after a week
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}

//telling the app to use a session
app.use(session(sessionConfig))
//telling the app the use flash which is dependant on the session
app.use(flash());
//telling the app to use passport
app.use(passport.initialize());
//using passport.session to tell the app to allow persistent sessions so every request 
//does not require passport authentication
app.use(passport.session());
//telling passport to use local strategy
//telling local strategy to authenticate user model
passport.use(new LocalStrategy(User.authenticate()));

//telling passport to store user in a session
passport.serializeUser(User.serializeUser());
//telling passport to remove user from session
passport.deserializeUser(User.deserializeUser());

//setting up a middleware to always run on every request 
//Most times flash will be empty but if a user completes something on our page this will run and the middleware will display error or success
app.use((req, res, next) => {
    res.locals.currentUser = req.user; //all templates will now have access to current user 
    if(res.locals.currentUser){
        res.locals.currentRole = req.user.role;
    }
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    next(); // call next to make it out
})


//telling the app to use user routes
app.use("/", userRoutes);
//telling app to use our expense routers with prefixed path
app.use("/expenses", expenseRoutes);


app.get("/", (req, res) => {
    res.render("home");
})

//404 if you make request not recognised
app.all("*", (req, res, next) => {
    next(new ExpressError("Page not found", 404))
})

//custom express error handler all next calls go here
app.use((err, req, res, next) => {
    //destructure from error and set defaults
    const {statusCode = 500} = err;
    if(!err.message) err.message = "Oh No, Something went wrong!"
    res.status(statusCode).render("error", {err})

})

//listen on the port
app.listen(3000, () => {
    console.log("Listening on Port 3000");
})
//url
//http://localhost:3000/

module.exports = app;