import express from 'express'

import authRoutes from './routes/auth.routes'
import { connectDB } from './config/db'

const app =express()
const PORT= 3001

connectDB("mongodb://127.0.0.1:27017/chatApplication")

app.use(express.json())

app.use('/api/auth',authRoutes)

app.listen(PORT,()=>console.log(`Server is running at port ${PORT}`))
