import dotenv from "dotenv"
dotenv.config();
import express from 'express'
import authRoutes from './routes/auth.routes'
import { connectDB } from './config/db'
import cookieParser from "cookie-parser";

const app = express()
const PORT = process.env.PORT || 3001

connectDB(process.env.MONGODB_URI as string)

app.use(cookieParser())
app.use(express.json())

app.use('/api/auth', authRoutes)

app.listen(PORT, () => console.log(`Server is running at port ${PORT}`))
