const Expenses = require("../models/expenses"); //require the model
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding"); // requiring the mapbox to geocode our locations
const mapBoxToken = process.env.MAPBOX_TOKEN; //get the token from mapbox
const geocoder = mbxGeocoding({accessToken: mapBoxToken}); //instantiate geocode

const nodemailer = require("nodemailer");






module.exports.index = async (req, res, next) => {
    //if the current user role is manager
    if(req.user.role === "manager"){
        const expenses = await Expenses.find({});
        expenses.sort((a,b) => b.expenseDate - a.expenseDate);//sort by date to see newest
        let arrayOfTotals = calculateTotalType(expenses);
        res.render("expenses/index", {expenses, arrayOfTotals})
        
    }
    //show only expense related to the current logged in user
    else{
        const expenses = await Expenses.find({employeeId: req.user._id});
        let arrayOfTotals = calculateTotalType(expenses);
        expenses.sort((a,b) => b.expenseDate - a.expenseDate); //sort by date to see newest
        res.render("expenses/index", {expenses, arrayOfTotals})
        res.render("expenses/index", {expenses, arrayOfTotals})
    }
    console.log(req.user.role);
}

module.exports.newForm = (req, res) => {
    res.render("expenses/new")
}

module.exports.createExpense = async(req, res, next) => {
    //create geodata by getting location from req  
    const geoData = await geocoder.forwardGeocode({
        query: req.body.expenses.location,
        limit: 1
    }).send()
    //get the image file from the request by mapping over and implicitly returning
    //if(!req.body.expense) throw new ExpressError("Invalid Expense Data", 400)
    const expense = new Expenses(req.body.expenses);
    //add the geometry taken from form and store in expense
    expense.geometry = geoData.body.features[0].geometry;
    //get the image file from the request by mapping over and implicitly returning
    expense.receipt = req.files.map(f => ({url: f.path, filename: f.filename}));
    //set the expense created to the current signed in employee
    expense.employeeId = req.user._id;
    //save
    await expense.save();
    console.log(expense);
    //email notification to manager
    sendEmail();
    //flash success
    req.flash("success", "Successfully made a new expense");
    //redirect to view expense
    res.redirect(`/expenses/${expense._id}`)
}

module.exports.showExpense = async (req, res, next) => {
    const expenses = await Expenses.findById(req.params.id)
    //if not expense found upon request
    if(!expenses){
        //flash error
        req.flash("error", "Cannot find that Expense");
        //redirect to expenses show page
        return res.redirect("/expenses")
    }
    res.render("expenses/show", {expenses})
}

module.exports.editForm = async (req, res, next) => {
    const expenses = await Expenses.findById(req.params.id) //looks up campgrounds by id
    //if no expense found
    if(!expenses){
        //flash error
        req.flash("error", "Cannot find that Expense");
        //redirect to expenses show page
        return res.redirect("/expenses")
    }
    res.render("expenses/edit", {expenses})
}

module.exports.updateExpense = async (req, res, next) => {
    const {id} = req.params; //get the id from params
    const expense = await Expenses.findByIdAndUpdate(id, {...req.body.expenses}) //find the expense in our database and use ... to spread the body of the put request into our desired target
    //save the result of mapping over and implicitly returning
    const receipts = req.files.map(f => ({url: f.path, filename: f.filename}))
    //spread it onto our expense
    expense.receipt.push(... receipts);
    await expense.save()
    req.flash("success", "Successfully updated expense");
    res.redirect(`/expenses/${expense._id}`)
}

module.exports.deleteExpense = async (req, res, next) => {
    const {id} = req.params; 
    await Expenses.findByIdAndDelete(id); 
    req.flash("success", "Successfully deleted an expense")
    res.redirect("/expenses");
}


//sending an email function
//export this and import when finishing up
async function sendEmail(){

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'automaticEmailAthena@gmail.com',
          pass: 'automaticEmailAthena22'
        },
        //email will not send without this set
        tls: {
            rejectUnauthorized: false
        }
  
      });
      
    const mailOptions = {
        from: 'automaticEmailAthena@gmail.com',
        to: 'eamonnAthena@gmail.com',
        subject: 'You have a new Expense to assess',
        text: `Hi Eamonn, You have 1 new expense from your team to assess`,
        html: '<h1> Hi Eamonn </h1> <p> An employee in your team has uploaded an expense. Please log in to assess.  </p>'
      };
      
    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });
    
}

function calculateTotalType(expenses){
    let arrayOfTotals = [];
    let totalDining = 0;
    let totalAccommodation = 0;
    let totalTravel = 0;
    let totalClient = 0;
    let totalPhone = 0;
    for(let expense of expenses){
        if (expense.expenseType === "dining"){
            totalDining = totalDining + expense.totalCost;
        }
        if (expense.expenseType === "accommodation"){
            totalAccommodation = totalAccommodation + expense.totalCost;
        }
        if (expense.expenseType === "travel"){
            totalTravel = totalTravel + expense.totalCost;
        }
        if (expense.expenseType === "client"){
            totalClient = totalClient + expense.totalCost;
        }
        if (expense.expenseType === "phone"){
            totalPhone = totalPhone + expense.totalCost;
        }
    }
    arrayOfTotals[0] = totalDining;
    arrayOfTotals[1] = totalAccommodation;
    arrayOfTotals[2] = totalTravel;
    arrayOfTotals[3] = totalClient;
    arrayOfTotals[4] = totalPhone;

    return arrayOfTotals;
}