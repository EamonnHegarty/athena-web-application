const Expenses = require("../models/expenses"); //require the model
const User = require("../models/user");
const mongoose = require("mongoose");


describe("Model Testing", () => {

    //before all tests
    beforeAll(async () => {
        //connecting to the database
        await mongoose.connect("mongodb://localhost:27017/employee-expenses", {
            useNewUrlParser: true,  
            useUnifiedTopology: true
            })
    })
    
    //testing creating a user
    test("User Model", async () => {

         //some variables to be used to create a user
         const username = "test";
         const email = "test@athena.com";
         const password = "password";
 
         //create new user
         const user = new User({email, username});
         
         //take new instance of user and password and then hash and salt
         //then save onto user
         const registeredUser = await User.register(user, password)
 
         //check that the user variable has been updated with a user
         expect(registeredUser).toEqual(expect.objectContaining(user))
         expect(registeredUser.username).toEqual("test");
         expect(registeredUser.email).toEqual("test@athena.com");

         //delete the user
        await User.deleteOne({username: "test"});
    });

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
                expenseDescription: "test2",
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
        

        //check if variables match
        expect(e1.totalCost).toBe(666)
        expect(e1.location).toBe("Malin Head, Donegal, Ireland")
        expect(e1.expenseDescription).toBe("test2")

        //delete the expense
        await Expenses.deleteOne({expenseDescription: "test2"});
    })
})