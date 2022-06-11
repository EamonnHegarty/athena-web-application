const mongoose = require("mongoose");
const Schema = mongoose.Schema; 
const passportLocalMongoose = require("passport-local-mongoose");


//creating user mongoose schema 
const UserSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    role: {
        type: String,
        default: "employee"
    }
})

//passing in the passport to our userschema which will add username and password
//passport will make it unique and provide methods 
//passport hash passwords and adds salt
UserSchema.plugin(passportLocalMongoose);

//compile and export
module.exports = mongoose.model("User", UserSchema);