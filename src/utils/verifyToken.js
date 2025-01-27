import dotenv from "dotenv"

import jwt from "jsonwebtoken"

dotenv.config()


const secret=process.env.SECRET  

function verifyToken(req){
    const authHeader = req.headers.authorization;
    console.log(req.headers.authorization)
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return { success: false, message: 'No token provided or incorrect format' };
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, secret);
    return { success: true, decoded };
  } catch (err) {
    return { success: false, message: 'Invalid token' };
  }
}

export default verifyToken;