import express from 'express'
import { protectRoute } from '../middleware/auth.middleare'
import { handleGetAllUser } from '../controllers/message.controller'

const router =express.Router()

router.get('/users',protectRoute,handleGetAllUser)

export default router