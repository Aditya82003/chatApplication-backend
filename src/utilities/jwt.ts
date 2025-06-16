import jwt, { SignOptions } from "jsonwebtoken";

const JWT_SECRET = "mysecretkey"        //replace by dotenv


export const generateToken = (payload: object): string => {
    return jwt.sign(payload, JWT_SECRET)
}

export const verifyToken = (token : string):any =>{
    try{
        return jwt.verify(token,JWT_SECRET)
    }catch(err){
        throw new Error("invlaid token")
    }

}