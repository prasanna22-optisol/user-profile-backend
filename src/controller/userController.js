import User from "../models/userSchema.js"

export const getUser=async(req,res)=>{
    try{
        const {id}=req.params
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

export const updateUser=async(req,res)=>{
    try{
        const {id}=req.params
        const updateData=req.body

        if(!updateData){
            return res.status(400).json({
                statusCode:400,
                message:"Please provide data to update"
            })
        }

        const updatedUser=await User.findByIdAndUpdate(
            id,
            {$set:updateData},
            {new : true , runValidators:true}
        );

        if(!updatedUser){
            return res.status(404).json({
                statusCode: 404,
                message: "User not found",
            })
        }

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


    }
    catch(err){
        console.log(err);
        return res.status(500).json({
            statusCode: 500,
            message: err.message,
        });   
    }
}

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