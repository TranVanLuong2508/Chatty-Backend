import cloudinary from "../lib/cloudinary.js"
import { getReceiverSocketId, io } from "../lib/socket.js"
import Message from "../models/message.model.js"
import User from "../models/user.model.js"


export const getUsersForSidebar = async (req, res) => {
    try {
        const loggedInUserId = req.user._id
        const filteredUsers = await User.find({ _id: { $ne: loggedInUserId } }).select("-password")
        res.status(200).json(filteredUsers)
    } catch (error) {
        console.log("Error in getUsersForSidebar: ", error.message)
        return res.status(500).json({ message: "Internal server error" })
    }
}

export const getMessage = async (req, res) => {
    try {
        const { id: userToChatId } = req.params
        const userId = req.user._id
        const messages = await Message.find({
            $or: [
                { senderId: userId, recieverId: userToChatId },
                { senderId: userToChatId, recieverId: userId }
            ]
        })
        return res.status(200).json(messages)
    } catch (error) {
        console.log("Error in getMessage: ", error.message)
        return res.status(500).json({ message: "Internal server error" })
    }
}

export const sendMessage = async (req, res) => {
    try {
        const { text, image } = req.body
        const { id: recieverId } = req.params
        const senderId = req.user._id

        let imageURL
        if (image) {
            const uploadResponse = await cloudinary.uploader.upload(image)
            imageURL = uploadResponse.secure_url
        }
        const newMessage = new Message(
            {
                senderId,
                recieverId,
                text,
                image: imageURL
            }
        )

        await newMessage.save()

        //todo: real-time functionally
        const receiverSocketId = getReceiverSocketId(recieverId)

        if (receiverSocketId) {
            io.to(receiverSocketId).emit("newMessage", newMessage)
        }

        res.status(201).json(newMessage);
    } catch (error) {
        console.log("Error in sendMessage: ", error.message)
        return res.status(500).json({ message: "Internal server error" })
    }
}
