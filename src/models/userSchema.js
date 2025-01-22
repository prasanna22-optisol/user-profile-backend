import mongoose from "mongoose";

const userSchema=new mongoose.Schema({

    password: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    fullName: { type: String, required: true },
    mobileNumber: { type: String, required: true },
    designation: { type: String, required: true },
    


},{
    timestamps:true
})

const User = mongoose.model('User', userSchema);

export default User;