import dotenv from "dotenv"
dotenv.config();
import express from 'express'
import authRoutes from './routes/auth.routes'
import messageRoutes from './routes/message.route'
import { connectDB } from './config/db'
import cookieParser from "cookie-parser";
import cors from 'cors'

const app = express()
const PORT = process.env.PORT || 3001

connectDB(process.env.MONGODB_URI as string)

app.use(cors({
    origin:'http://localhost:5173',
    credentials:true
}))

app.use(express.json({limit:'20mb'}))
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

app.use(cookieParser())


app.use('/api/auth', authRoutes)
app.use('/api/message',messageRoutes)

app.listen(PORT, () => console.log(`Server is running at port ${PORT}`))
