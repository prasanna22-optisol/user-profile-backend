import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const secret = process.env.SECRET;
const age = 1000 * 60 * 60 * 24 * 7; // 1 week

export function generateToken(userId, res) {
  try {
    const token = jwt.sign({ userId }, secret, {
      expiresIn: age / 1000, // expiresIn expects seconds
    });
    // console.log("Token generated:", token);

    // Set token in a cookie
    res.cookie("token", token, {
      maxAge: age,
      httpOnly:false,
      secure: process.env.NODE_ENV === "production", // Use HTTPS in production
      sameSite: "lax",
      path:"/"
    });
  } catch (e) {
    console.error("Error generating cookie:", e);
  }
}
