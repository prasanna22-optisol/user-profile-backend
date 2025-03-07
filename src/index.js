import express from "express"


process.env.NODE_ENV==='development'

import dotenv from 'dotenv'
import {connectDB} from "./database/db.js";
import cookieParser from "cookie-parser";
import authRouter from "./routes/authRoute.js";
import userRouter from "./routes/userRoute.js";
import cors from "cors";

dotenv.config();



const port = process.env.PORT
const url=process.env.MONGO_URL



const app=express()


app.use(express.json())
app.use(cookieParser())
app.use(express.urlencoded({ extended:true}))


app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
    
    
}))

app.use("/api/auth",authRouter)
app.use("/api/users",userRouter)

connectDB(url)

app.get("/",(req,res)=>{
    res.send("Hello, World!")
})

app.listen(port,()=>{
    console.log(`Look at http://localhost:${port}`)
})






