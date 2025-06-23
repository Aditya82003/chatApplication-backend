import { NextFunction, Request, Response } from "express";
import { verifyToken } from "../utilities/jwt";
import { JwtPayload } from "jsonwebtoken";
import User from "../models/user.model";

export const protectRoute = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { token } = req.cookies
        if (!token) {
            res.status(401).json({message:"Unauthorized - No Token Provided"})
            return
        }
        const decoded = verifyToken(token)
        const user = await User.findById(decoded.id).select("-password")
        if (!user) {
            res.status(401).json({ message: "User not found" });
            return;
        }
        const Details = {
            _id: user._id.toString(),
            fullName: user.fullName,
            email: user.email,
            profilePic: user.profilePic
        }

        req.user = Details

        next()

    } catch (err) {
        res.status(401).json({ message: "Unauthorized" });
    }
}  