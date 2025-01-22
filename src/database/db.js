import mongoose from "mongoose";

export async function connectDB(url){
    try{
        await mongoose.connect(url)
        console.log("Database connected")
    }
    catch(err){
        console.log("Error: ",err)
    }
}
