// auth.controller.js
import User from "../models/userSchema.js";
import { generateToken } from "../utils/generateToken.js";
import { LoginValidation, RegisterValidation } from "../validations/authValidation.js";
import bcrypt from "bcryptjs";

export const login = async (req, res) => {
    try {

        const {error}=LoginValidation.validate(req.body)
        if(error){
            return res.status(400).json({
                statusCode:400,
                message:error.message
            })
        }
        const { email, password } = req.body;

        const checkUser=await User.findOne({email})
        const compare=await bcrypt.compare(password,checkUser.password)
        if(!checkUser || !compare){
            return res.status(403).json({
                statusCode:403,
                message:"Bad credentials"
            })
        }
        generateToken(checkUser._id,res)

        return res.status(200).json({
            statusCode:200,
            message:"User logged in successfully",
            data:{
                _id:checkUser._id,
                email,
                fullName:checkUser.fullName,
                mobileNumber:checkUser.mobileNumber,
                designation:checkUser.designation,

            }
        })
        // your login logic here
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            statusCode: 500,
            message: error.message,
        });
    }
};

export const register = async (req, res) => {
    try {
        const { error } = RegisterValidation.validate(req.body);
        if (error) {
            return res.status(400).json({
                statusCode: 400,
                message: error.message,
            });
        }
        const { email, password, confirmPassword, fullName, mobileNumber, designation } = req.body;

        if (password !== confirmPassword) {
            return res.status(400).json({
                statusCode: 400,
                message: "Password does not match",
            });
        }

        const checkUser = await User.findOne({ email });
        if (checkUser) {
            return res.status(403).json({
                statusCode: 403,
                message: "User already exists",
            });
        }

        const hashedPassword = await bcrypt.hashSync(password, 10);

        const newUser=await User.create({
            fullName,
            email,
            password:hashedPassword,
            mobileNumber,
            designation,
            
        })
       
        generateToken(newUser._id,res)

        return res.status(201).json({
            statusCode:201,
            message:"User registered successfully",
            data:{
                _id:newUser._id,
                fullName:newUser.fullName,
                email:newUser.email,
                mobileNumber:newUser.mobileNumber,
                designation:newUser.designation,
            }

        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            statusCode: 500,
            message: error.message,
        });
    }
};

export const logout = async (req, res) => {
    try{
        res.cookie("jwt", '', { maxAge: 0, path: '/' });
        res.status(200).json({
            "message":"Logged out"
        })
    }
    catch(error) {
        console.log(error);
        return res.status(500).json({
            statusCode: 500,
            message: error.message,
        });
    }
}
