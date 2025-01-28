import bcrypt from "bcryptjs"
import User from "../models/userSchema.js"
import { ObjectId } from 'mongodb'; 
import verifyToken from "../utils/verifyToken.js";
import nodemon from "nodemon";

import nodemailer from "nodemailer"

import crypto from "crypto";
import dotenv from "dotenv";
import { type } from "os";

dotenv.config();// Import ObjectId

export const getUser=async(req,res)=>{
    try{
        // const { success, message, decoded } = verifyToken(req);

        // if (!success) {
        //    return res.status(401).json({ error: message });
        // }

        const {id}=req.params

        if (!ObjectId.isValid(id)) {
            return res.status(400).json({
                statusCode: 400,
                message: "Invalid ID format"
            });
        }
        const user=await User.findById(id)
        if(!user){
            return res.status(404).json({
                statusCode:404,
                message:"User not found"
            })
        }
        return res.status(200).json({
            statusCode:200,
            message:"User found",
            data:{
                _id:user._id,
                email:user.email,
                fullName:user.fullName,
                mobileNumber:user.mobileNumber,
                designation:user.designation
            }
        })
    }
    catch(err){
        console.log(err)
        return res.status(500).json({
            statusCode:500,
            message:err.message
        })
    }
}
export const updateUser = async (req, res) => {
    try {
      const { id } = req.params;
      const updateData = req.body;
  
      // Check if updateData has any valid keys
      if (!updateData || Object.keys(updateData).length === 0) {
        return res.status(400).json({
          statusCode: 400,
          message: "Please provide data to update",
        });
      }
  
      // Attempt to update the user
      const updatedUser = await User.findByIdAndUpdate(
        id,
        { $set: updateData },
        { new: true, runValidators: false } // Skipping required field validations
      );
  
      // Check if user exists
      if (!updatedUser) {
        return res.status(404).json({
          statusCode: 404,
          message: "User not found",
        });
      }
  
      // Send success response
      return res.status(200).json({
        statusCode: 200,
        message: "User updated successfully",
        data: {
          _id: updatedUser._id,
          fullName: updatedUser.fullName,
          email: updatedUser.email,
          mobileNumber: updatedUser.mobileNumber,
          designation: updatedUser.designation,
        },
      });
    } catch (err) {
      // Log and send error response
      console.error("Error updating user:", err);
      return res.status(500).json({
        statusCode: 500,
        message: "An error occurred while updating the user",
        error: err.message,
      });
    }
  };
  
export const getAllUsers=async(req,res)=>{
    try{
        const users=await User.find().select("-password")
        return res.status(200).json({
            statusCode:200,
            message:"All users",
            data:users
        })
    }
    catch(err){
        console.log(err);
        return res.status(500).json({
            statusCode: 500,
            message: err.message,
        });
    }
}

export const deleteUser=async(req,res)=>{
    try{
        const {id}=req.params
        const deletedUser=await User.findByIdAndDelete(id)

        if(!deletedUser){
            return res.status(404).json({
                statusCode:404,
                message:"User not found"
            })
        }

        return res.status(200).json({
            statusCode:200,
            message:"User deleted successfully",
            data:deletedUser
        })
    }
    catch(err){
        console.log(err);
        return res.status(500).json({
            statusCode: 500,
            message: err.message,
        });
    }
}

export const forgotPassword=async(req,res)=>{
    const {email}=req.body
    try{
        const user=await User.findOne({email})
        if(!user){
            return res.status(404).json({
                statusCode:404,
                message:"User not found"
            })
        }

        const resetToken=crypto.randomBytes(32).toString("hex")
        const resetTokenExpiry = Date.now() + 3600000000;


        user.resetPasswordToken = resetToken;
        user.resetPasswordTokenExpiry = resetTokenExpiry;

        const resetMailUrl=`http://localhost:5173/reset/${resetToken}`
        const yopMailUrl = `https://yopmail.com/en/mail/compose
        // ?to=${email}&subject=Password%20Reset%20Request&message=${encodeURIComponent(`Click the following link to reset your password: ${resetMailUrl}`)}`;

        await user.save()

        const transport=nodemailer.createTransport({
            service:'gmail',
            auth:{
                user:'kristelklear200@gmail.com',
                pass:process.env.APP_PASSWORD
            }
        })

        const mailOptions = {
            from: 'User Profiler', 
            to: email, 
            subject: 'Password Reset Request',
            html: `
                <h2>Password Reset</h2>
                <p>You requested a password reset. Click the link below to reset your password:</p>
                <a href="${resetMailUrl}" target="_blank">${resetMailUrl}</a>
                <p>If you did not request this, please ignore this email.</p>
            ` 
        };

        await transport.sendMail(mailOptions)


        console.log(`The password reset link was sent to the email address: ${yopMailUrl}`)

        return res.status(200).json({
            statusCode:200,
            message:"Password reset link sent successfully",
            token:resetToken
        })
    }
    catch(err){
        console.log(err);
        return res.status(500).json({
            statusCode: 500,
            message: err.message,
        });
    }
}

export const resetPassword=async(req,res)=>{
    try{
        const {token,newPassword,confirmPassword}=req.body


        const user=await User.findOne({
            resetPasswordToken:token,
            resetPasswordTokenExpiry:{$gt:Date.now()}
        })

        if(!user){
            return res.status(401).json({
                statusCode:401,
                message:"Password reset token expired or invalid"
            })
        }

        if(!newPassword || !confirmPassword || newPassword!==confirmPassword){
            return res.status(400).json({
                statusCode:400,
                message:"Passwords do not match"
            })
        }
        if(newPassword.length<4){
            return res.status(400).json({
                statusCode:400,
                message:"Password must be at least 4 characters long"
            })
        }
        const userId=user._id
        const hashedPassword=await bcrypt.hash(newPassword,10)
        const updatedUser=await User.findByIdAndUpdate(userId,{password:hashedPassword,resetPasswordToken:undefined,resetPasswordTokenExpiry:undefined},{new:true})

        if(!updateUser){
            return res.status(404).json({
                statusCode:404,
                message:"User not found"
            })
        }
        return res.status(200).json({
            statusCode:200,
            message:"Password reset successfully"
        })

    }
    catch(err){
        console.log(err);
        return res.status(500).json({
            statusCode: 500,
            message: err.message,
        });
    }
}