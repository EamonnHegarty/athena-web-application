const mongoose = require("mongoose");
const Schema = mongoose.Schema; 

const ExpensesSchema = new Schema({
    employeeId:{
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    //geoJson schema 
    geometry: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    totalCost: Number, 
    location: String,
    expenseType: { //this will be a drop down i just do not know how to make it one and update the database
        type:String, 
        lowercase: true,
        enum: ["travel", "accommodation", "dining", "client", "phone"]
    },
    expenseDate: Date,
    currentDate: Date,
    expenseDescription: String,
    status: {
        type: String,
        default: "pending"
    },
    receipt: [
        {
        url: String,
        filename: String
        }
    ]
})

module.exports = mongoose.model("Expenses", ExpensesSchema);