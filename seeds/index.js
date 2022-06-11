const mongoose = require("mongoose");
const fakeData = require("./expenses"); 
const Expenses = require("../models/expenses");

//using mongoose to connect to the database
mongoose.connect("mongodb://localhost:27017/employee-expenses", {
    useNewUrlParser: true,  
    useUnifiedTopology: true
})

//checking if the connection has occurred
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database Connected");
})

//input and save the fake data
const seedDB = async() => {
    await Expenses.deleteMany({}); //delete it first so the database always has the same fake data every time it is called
    for( let i = 0; i < 10; i++){
        const e1 = new Expenses(
            {
                employeeId: "622a1e3beba4a065b617761e", 
                geometry : {
                    type: "Point", 
                    coordinates : [-6.266155, 	53.350140]
                },
                totalCost: fakeData[i].totalCost, 
                location: fakeData[i].location,
                expenseType: fakeData[i].expenseType,
                expenseDate: fakeData[i].expenseDate,
                currentDate: fakeData[i].currentDate,
                expenseDescription: fakeData[i].expenseDescription,
                status: fakeData[i].status,
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

        await e1.save();
    }
}

//seed the db then close the connection
seedDB().then(() => {
    mongoose.connection.close();
}); 
