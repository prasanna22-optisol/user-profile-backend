import express from 'express'
import { deleteUser, forgotPassword, getAllUsers, getUser, updateUser ,resetPassword} from '../controller/userController.js'
import { protectRoute } from '../middleware/protect.js'



const userRouter=express.Router()

userRouter.put('/update/:id',protectRoute, updateUser);
userRouter.get("/get-user/:id",protectRoute,getUser)
userRouter.get("/all",getAllUsers)
userRouter.delete("/delete",deleteUser);
userRouter.post("/forgot-password",forgotPassword);
userRouter.patch("/reset-password",resetPassword);
export default userRouter