import mongoose from "mongoose"
import User from "../models/user.model.js"
import bcrypt from "bcryptjs"
import { generateJwtToken } from "../lib/util.js"

export const login = (req, res) => {
    res.send("signup route")
}

export const signup = async (req, res) => {
    const { email, fullName, password } = req.body
    try {
        if (!email || !fullName || !password) {
            return res.status(400).json({ message: "All fields are required !!!" })
        }

        if (password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 Characters !!!" })
        }

        const existingUser = await User.findOne({ email })
        if (existingUser) return res.status(400).json({ message: "User already exists" })
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        const newUser = new User({
            fullName,
            password: hashedPassword,
            email
        })
        if (newUser) {
            generateJwtToken(newUser._id, res)
            await newUser.save()
            return res.status(201).json({
                _id: newUser._id,
                fullName: newUser.fullName,
                email: newUser.email,
                profilePic: newUser.profilePic
            })
        } else {
            return res.status(400).json({ message: "Invalid user data" })
        }
    } catch (error) {
        console.log("Error in sign up controller", error.message)
        return res.status(500).json({ message: "Internal Server Error" })
    }
}

export const logout = (req, res) => {
    res.send("logout route")
}
