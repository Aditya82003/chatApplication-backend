import { Request, Response } from "express";
import User from "../models/user.model";
import Message from "../models/message.model";
import { send } from "process";
import cloudinary from "../config/cloudinary";

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

export const handleGetMessage = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id: userToChatId } = req.params
        const myId = req.user?._id

        const message = await Message.find({
            $or: [
                { senderId: myId, receiverId: userToChatId },
                { senderId: userToChatId, receiverId: myId }
            ]
        })
        if (!message) {
            res.status(400).json({
                message: "No Message found"
            })
        }
        res.status(200).json({
            message: "Message Found",
            chats: message
        })

    } catch (err) {
        res.status(500).json({
            message: "internal error"
        })
    }

}


export const handleSendMessage = async (req: Request, res: Response): Promise<void> => {
    try {
        const { text, image } = req.body
        const { id: receiverId } = req.params
        const senderId = req.user?._id

         if (!senderId || !receiverId) {
            res.status(400).json({ message: "Sender or Receiver ID missing" });
            return;
        }

        let imageUrl: string | undefined
        if (image) {
                const uploadResponse = await cloudinary.uploader.upload(image)
                imageUrl = uploadResponse.secure_url
    
        }
        if (!text && !imageUrl) {
            res.status(400).json({ message: "No message content provided" });
            return;
        }

        const newMessage = await Message.create({
            senderId,
            receiverId,
            text,
            image: imageUrl
        })
        if (!newMessage) {
            res.status(400).json({
                messagee: "Failed to send a message"
            })
            return
        }
        res.status(200).json({
            message: "Message sent successfully",
            chat: newMessage
        })


    } catch (err) {
        res.status(500).json({
            message: "Internal server error",
            error: err instanceof Error ? err.message : String(err),
        });
    }
}