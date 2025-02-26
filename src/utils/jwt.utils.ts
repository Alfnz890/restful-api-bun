import * as jwt from 'jsonwebtoken'

const SECRET_KEY = process.env.SECRET_KEY || "123";

export const generateToken = (payload: object) => {
   return jwt.sign(payload, SECRET_KEY, { expiresIn: "1h" })
}

export const verifyToken = (token: string) => {
   try {
      return jwt.verify(token, SECRET_KEY)
   } catch (error) {
      return null;
   }
}