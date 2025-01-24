import jwt from "jsonwebtoken"
import dotenv from "dotenv"
import express from "express"
import User from "../models/userSchema.js"

dotenv.config()

const secret=process.env.SECRET

const extractTokenFromCookies=(req)=>{
    const token=req.cookies?.token
    console.log("Cookies extracted : ",req.cookies)
    return token
}


export const protectRoute=async(req,res,next)=>{
    try{
        const token = extractTokenFromCookies(req)
        console.log(token)
        if(!token){
            return res.status(401).json({message:"You need to login"})
        }

        const decoded=jwt.verify(token,secret)

        console.log(decoded)


        if (!decoded || !decoded.userId) {
            return res.status(401).json({ message: 'Invalid token, unauthorized' });
        }
        const user = await User.findById(decoded.userId).select('-password').exec();

        // console.log(user)

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        req.user = {
            id: user._id.toString(),
            fullName: user.fullName,
            email: user.email,
            mobileNumber: user.mobileNumber,
            designation: user.designation,
        };
        next()
    }
    catch (err) {
        console.log('Error in protectRoute middleware:', err);
        if (err instanceof jwt.JsonWebTokenError) {
            return res.status(401).json({ message: 'Token is invalid or malformed, unauthorized' });
        }
        return res.status(500).json({ message: 'Internal server error' });
    }
}