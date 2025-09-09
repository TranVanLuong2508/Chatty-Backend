import express from "express"
import authRoutes from "./routes/auth.route.js"
import messageRoutes from "./routes/message.route.js"
import dotenv from "dotenv"
import { connectDB } from "./lib/db.js"
import cookieParser from "cookie-parser"
import cors from "cors"
import { app, server } from "./lib/socket.js"

const port = process.env.PORT
const frontend_url = process.env.REACT_URL

dotenv.config()
app.use(express.json({ limit: "10mb" }))
app.use(cookieParser({ limit: "10mb" }))
app.use(cors({
    origin: frontend_url,
    credentials: true
}))

app.use('/api/auth', authRoutes)
app.use('/api/message', messageRoutes)

server.listen(port, () => {
    console.log("server is running on port: " + port)
    connectDB()
})