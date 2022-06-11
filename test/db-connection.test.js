require("dotenv").config();

const mongoose = require("mongoose");

const User = require("../models/user");
const Expenses = require("../models/expenses"); //require the model



describe("Database Testing", () => {
    
    //before all tests
    beforeAll(async () => {
        //connecting to the database
        await mongoose.connect("mongodb://localhost:27017/employee-expenses", {
            useNewUrlParser: true,  
            useUnifiedTopology: true
            })
    })
    
    //testing getting a user from the database
    test("Get user", async () => {

        //id of existing user found in mongo
        const id = "626130c630c1d9d5f11ca592";

        //get the user from the database
        const user = await User.findById(id)

        //check if the email of returned user matches email in mongo db. 
        expect(user.email).toBe("eamonn@manager.com")
    });

    //testing the create user functionality
    test("Create User", async () => {

         //some variables to be used to create a user
         const username = "obama";
         const email = "obama@athena.com";
         const password = "password";
 
         //create new user
         const user = new User({email, username});
         
         //take new instance of user and password and then hash and salt
         //then save onto user
         const registeredUser = await User.register(user, password)
 
         //check that the user variable has been updated with a user
         expect(user).toEqual(expect.objectContaining(user))

         //delete the user
        await User.deleteOne({username: "obama"});
    })

    //testing the delete functionality
    test("Delete User", async () => {
        //some variables to be used to create a user
        const username = "obama";
        const email = "obama@athena.com";
        const password = "password";

        //create new user
        const user = new User({email, username});
        
        //take new instance of user and password and then hash and salt
        //then save onto user
        const registeredUser = await User.register(user, password)

        //delete the user
        await User.deleteOne({username: "obama"});

        //check that user is empty
        expect(user).not.toBe(expect.objectContaining(user))
    })

    //testing update user
    test("Update User", async () => {
        
        //some variables to be used to create a user
        const username = "obama";
        const email = "obama@athena.com";
        const password = "password";

        //create new user
        const user = new User({email, username});
        
        //take new instance of user and password and then hash and salt
        //then save onto user
        const registeredUser = await User.register(user, password)

        //find and update the user
        const updateUser = await User.findOneAndUpdate({"username": "obama"}, {$set:{username:"timtomtoo"}}, {new:true})

        //make sure the updated username is not obama
        expect(updateUser.username).toBe("timtomtoo");


        //delete user from database
        await User.deleteOne({email: "obama@athena.com"});
        
    })

    //testing get expense
    test("Get Expense", async () => {

        //variable to be used to get expense
        const id = "625692d002e64f9adafc9c7b"
        
        //get the expense
        const expense = await Expenses.findById(id)

        //check if data represents data in database
        expect(expense.totalCost).toBe(44.44)
        expect(expense.location).toBe("Malin Head, Donegal")
    })

    //testing create expense
    test("Create Expense", async () => {
        
        //variable to be used to create an expense
        const e1 = new Expenses(
            {
                employeeId: "622a1e3beba4a065b617761e", 
                geometry : {
                    type: "Point", 
                    coordinates : [-6.266155, 	53.350140]
                },
                totalCost: 666, 
                location: "Malin Head, Donegal, Ireland",
                expenseType: "Dining",
                expenseDate: "2022-01-12",
                currentDate: "2022-02-17",
                expenseDescription: "test",
                status: "pending",
                receipt: [
                    {
                      url: 'https://res.cloudinary.com/dbv4xj1jr/image/upload/v1649840779/Athena/piggnsmnbo4fjv8sx8mp.jpg',
                      filename: 'Athena/piggnsmnbo4fjv8sx8mp',
                    },
                    {
                      url: 'https://res.cloudinary.com/dbv4xj1jr/image/upload/v1649840780/Athena/uy02olsxqvdnhsamhdiy.jpg',
                      filename: 'Athena/uy02olsxqvdnhsamhdiy',
                    }
                ]
            }
        )
        //save the expenses
        await e1.save();
        
        //find the expenses
        const e2 = await Expenses.find({"employeeId" : "622a1e3beba4a065b617761e"})

        //check if variables match
        expect(e1.totalCost).toBe(666)
        expect(e1.location).toBe("Malin Head, Donegal, Ireland")
        expect(e1.expenseDescription).toBe("test")

        //delete the expense
        await Expenses.deleteOne({expenseDescription: "test"});
    })

    test("Update expense", async () => {
        //variable to be used to create an expense
        const e1 = new Expenses(
            {
                employeeId: "622a1e3beba4a065b617761e", 
                geometry : {
                    type: "Point", 
                    coordinates : [-6.266155, 	53.350140]
                },
                totalCost: 666, 
                location: "Malin Head, Donegal, Ireland",
                expenseType: "Dining",
                expenseDate: "2022-01-12",
                currentDate: "2022-02-17",
                expenseDescription: "test",
                status: "pending",
                receipt: [
                    {
                      url: 'https://res.cloudinary.com/dbv4xj1jr/image/upload/v1649840779/Athena/piggnsmnbo4fjv8sx8mp.jpg',
                      filename: 'Athena/piggnsmnbo4fjv8sx8mp',
                    },
                    {
                      url: 'https://res.cloudinary.com/dbv4xj1jr/image/upload/v1649840780/Athena/uy02olsxqvdnhsamhdiy.jpg',
                      filename: 'Athena/uy02olsxqvdnhsamhdiy',
                    }
                ]
            }
        )
        //save the expenses
        await e1.save();

        //find and update the user
        const updatedExpense = await Expenses.findOneAndUpdate({"expenseDescription": "test"}, {$set:{expenseDescription:"not expense"}}, {new:true})
        
        //make sure the updated username is not obama
        expect(updatedExpense.expenseDescription).toBe("not expense");

        //delete user from database
        await Expenses.deleteOne({expenseDescription: "test"});
    
    })

    test("Deleting an Expense", async () => {
        //variable to be used to create an expense
        const e1 = new Expenses(
            {
                employeeId: "622a1e3beba4a065b617761e", 
                geometry : {
                    type: "Point", 
                    coordinates : [-6.266155, 	53.350140]
                },
                totalCost: 666, 
                location: "Malin Head, Donegal, Ireland",
                expenseType: "Dining",
                expenseDate: "2022-01-12",
                currentDate: "2022-02-17",
                expenseDescription: "test",
                status: "pending",
                receipt: [
                    {
                      url: 'https://res.cloudinary.com/dbv4xj1jr/image/upload/v1649840779/Athena/piggnsmnbo4fjv8sx8mp.jpg',
                      filename: 'Athena/piggnsmnbo4fjv8sx8mp',
                    },
                    {
                      url: 'https://res.cloudinary.com/dbv4xj1jr/image/upload/v1649840780/Athena/uy02olsxqvdnhsamhdiy.jpg',
                      filename: 'Athena/uy02olsxqvdnhsamhdiy',
                    }
                ]
            }
        )
        //save the expenses
        await e1.save();

        //delete the user
        await Expenses.deleteOne({expenseDescription: "test"});

        //check that user is empty
        expect(e1).not.toBe(expect.objectContaining(e1))

    })

    

    
});




