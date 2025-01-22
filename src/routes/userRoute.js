import express from 'express'
import { deleteUser, getAllUsers, getUser, updateUser } from '../controller/userController.js'
import { protectRoute } from '../middleware/protect.js'



const userRouter=express.Router()

userRouter.put('/update/:id', protectRoute, updateUser);
userRouter.get("/get-user/:id",protectRoute,getUser)
userRouter.get("/all",protectRoute,getAllUsers)
userRouter.delete("/delete",protectRoute,deleteUser);
export default userRouter