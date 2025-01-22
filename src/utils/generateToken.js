
import jwt from "jsonwebtoken"

import dotenv from "dotenv"

dotenv.config()

const secret=process.env.SECRET

const age=1000*60*60*24*7

export function generateToken(userId,res){
    try{
        const token=jwt.sign({userId},secret,{
            expiresIn:age
        })
        res.cookie("token",token,{
            maxAge: age,
            httpOnly: true,
            secure: false, // Only send over HTTPS in production
            sameSite: "strict", // Adjust if needed
        })
    }catch(e){
        console.error("Error generating token:", e);
    }
}