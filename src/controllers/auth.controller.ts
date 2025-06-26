import { Request, Response } from "express";
import User from "../models/user.model";
import bcrypt from 'bcrypt';
import { generateToken } from "../utilities/jwt";
import cloudinary from "../config/cloudinary";


export const handleSignin = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body
        if (!email || !password) {
            res.status(400).json({ message: "Please provide all details" })
            return
        }
        const user = await User.findOne({ email })
        if (!user) {
            res.status(400).json({ message: "Invalid credential" })
            return
        }
        const isMatched = await bcrypt.compare(password, user?.password)
        if (!isMatched) {
            res.status(400).json({ message: "Invalid credential" })
            return
        }
        const token = generateToken({ id: user._id.toString() })
        res.cookie("token", token, {
            httpOnly: true,
            maxAge: 7 * 24 * 60 * 60 * 1000,
            secure: process.env.NODE_ENV === "production"
        })
        res.status(200).json({
            message: "successful",
            id: token
        })

    } catch (err) {
        console.error("Signup error:", err);
        res.status(500).json({ message: "Server error during signup" });
    }
}

export const handleSignUp = async (req: Request, res: Response): Promise<void> => {
    try {
        const { fullName, email, password } = req.body

        if (!fullName || !email || !password) {
            res.status(400).json({ message: "PLease Provide all the details" })
            return
        }

        const existinguser = await User.findOne({ email })
        if (existinguser) {
            res.status(400).json({ message: "Email already found" })
            return
        }

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        const newUser = await User.create({
            email,
            fullName,
            password: hashedPassword
        })

        if (!newUser) {
            res.status(400).json({ message: "Something happend wrong" })
            return
        }

        const token = generateToken({ id: newUser._id.toString() })
        res.cookie("token", token, {
            maxAge: 7 * 24 * 60 * 60 * 60,
            httpOnly: true

        })
        res.status(200).json({
            message: "successful",
            user:{
                _id:newUser._id,
                fullName:newUser.fullName,
                email:newUser.email, 
                profile:newUser.profilePic || null
            }
        })


    } catch (err) {
        console.error("Signup error:", err);
        res.status(500).json({ message: "Server error during signup" });
    }
}



export const handleSignOut = async (req: Request, res: Response): Promise<void> => {
    res.clearCookie("token", {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        path: "/",
    });

    res.status(200).json({ message: "Logged out successfully" });
    return
}


export const handleUploadProfile = async (req: Request, res: Response): Promise<void> => {
    try {
        const { profilePic } = req.body
        const userId = req.user?._id

        if (!profilePic) {
            res.status(400).json({
                message: "Profile pic not Found"
            })
            return
        }
        const uploadResponse = await cloudinary.uploader.upload(profilePic)
        const updatedUser = await User.findByIdAndUpdate(userId, { profilePic: uploadResponse.secure_url }, { new: true })

        if (!updatedUser) {
            res.status(400).json({
                message: "can't find the user after uploading file"
            })
            return
        }
        res.status(200).json({
            message: "Profile Pic successfully Uploaded",
            file: uploadResponse.secure_url
        })
    } catch (err) {
        res.status(500).json({
            message: "internal error"
        })
    }
}

export const handleCheckAuth = async (req:Request,res:Response):Promise<void>=>{
    try{
        res.status(200).json(req.user)
    }catch(err){
        res.status(500).json({
            message:"Interal server error"
        })
    }


}