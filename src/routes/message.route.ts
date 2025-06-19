import express from 'express'
import { protectRoute } from '../middleware/auth.middleare'
import { handleGetAllUser, handleGetMessage, handleSendMessage } from '../controllers/message.controller'

const router =express.Router()

router.get('/users',protectRoute,handleGetAllUser)
router.get('/:id',protectRoute, handleGetMessage )

router.post('/:id',protectRoute,handleSendMessage)
export default router