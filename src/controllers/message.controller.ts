import { Request, Response } from "express";
import User from "../models/user.model";

export const handleGetAllUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const loggedInUserId = req.user?._id
        if (!loggedInUserId) {
            res.status(400).json({
                message: "Please login"
            })
            return
        }
        const filteredUsers = await User.find({ _id: { $ne: loggedInUserId } }).select("-password")
        res.status(200).json({
            message: "Get users",
            user: filteredUsers
        })
    }
    catch (err) {
        res.status(500).json({
            message: "internal error"
        })
    }

}