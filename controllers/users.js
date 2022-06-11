const User = require("../models/user");

module.exports.renderRegister =(req, res) => {
    res.render("users/register");
}

module.exports.register = async (req, res) => {
    //try make the new user
    try{
        //destructuring from req.body
        const {email, username, password} = req.body;
        //create new user
        const user = new User({email, username});
        //take new instance of user and password and then hash and salt
        //then save onto user
        const registeredUser = await User.register(user, password)
        //using passport method to log in user after registering
        req.login(registeredUser, err => {
            //implement callback that passport method requires implemented
            if(err) return next(err);
        })
        //confirm new user
        req.flash("success", "Welcome to Athena Expense Application");
        //redirect
        res.redirect("/expenses");
    //if error is caught
    } catch(e){
        //flash error
        req.flash("error", e.message)
        //redirect to register
        res.redirect("register")
    }  
}

module.exports.renderLogin = (req, res) => {
    res.render("users/login");
}

module.exports.login = (req, res) => {
    req.flash("success", "welcome back");
    res.redirect("/expenses")
}

module.exports.logout = (req, res) => {
    req.logout();
    req.flash("success", "logged you out")
    res.redirect("/");
}