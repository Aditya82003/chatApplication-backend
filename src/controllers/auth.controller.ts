import { Request, Response } from "express";
import User from "../models/user.model";
import bcrypt from 'bcrypt';
import { generateToken } from "../utilities/jwt";


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
        const token = generateToken({ ...user })
        res.cookie("token", token)
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

        const token = generateToken({ ...newUser })
        res.cookie("token", token)
        res.status(200).json({
            message: "successful",
            id: token
        })


    } catch (err) {
        console.error("Signup error:", err);
        res.status(500).json({ message: "Server error during signup" });
    }
}



export const handleSignOut = async (req: Request, res: Response) => {
    res.clearCookie("token", {
        httpOnly: true,
        secure: true, // make sure to match what was set
        sameSite: "strict",
        path: "/",
    });

    res.status(200).json({ message: "Logged out successfully" });
}