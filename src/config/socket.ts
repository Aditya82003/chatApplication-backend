import express from 'express'
import http from 'http'
import { Server } from 'socket.io'
const app = express()
const server = http.createServer(app)

const io = new Server(server, {
    cors: {
        origin: ["http://localhost:5173"],
    },
})
export function getReceiverSocketId(userId: string): string | undefined {
    return userSocketMap[userId]
}

const userSocketMap: Record<string, string> = {}

io.on('connection', (socket) => {
    console.log("A user connected", socket.id)

    const userId = socket.handshake.query.userId as string | undefined
    if (userId) userSocketMap[userId] = socket.id
    io.emit("getOnlineUsers", Object.keys(userSocketMap))

    socket.on('join-room',({roomId,name})=>{
        socket.join(roomId)
        socket.to(roomId).emit('user-joined', `${name} has joined the room`)

})
    socket.on('send-message',({roomId,message})=>{
        io.to(roomId).emit('receive-message',{
            socket:socket.id,
            message
        })
    })
    socket.on('leave-room', ({roomId,name}) => {
    socket.leave(roomId)
    console.log(`${socket.id} left room ${roomId}`)
    socket.to(roomId).emit('user-left', `${name} has left the room`)
  })

    socket.on("disconnect", () => {
        console.log("A user disconnected", socket.id)
        if (userId) {
            delete userSocketMap[userId]
        }
        io.emit("getOnlineUsers", Object.keys(userSocketMap))
    })
})

export { io, app, server }