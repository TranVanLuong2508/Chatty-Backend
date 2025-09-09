import { Server } from "socket.io"
import express from "express"
import http from "http"

//create app from express
const app = express()

//create HTTP server from app
const server = http.createServer(app)

//create Socket.IO server
const io = new Server(server, {
    cors: {
        origin: [process.env.REACT_URL]
    }
})

export function getReceiverSocketId(userId) {
    return userSocketMap[userId]
}

const userSocketMap = {} //{userId: socketId}


io.on("connection", (socket) => {
    console.log("A user connected!!!", socket.id)

    const userId = socket.handshake.query.userId
    if (userId) userSocketMap[userId] = socket.id

    //io.emit() is used to send events to all the connected clients
    io.emit("getOnlineUsers", Object.keys(userSocketMap))

    socket.on("disconnect", () => {
        console.log("A user disconnnected!!!", socket.id)
        delete userSocketMap[userId]
        io.emit("getOnlineUsers", Object.keys(userSocketMap))
    })
})

export { io, server, app }