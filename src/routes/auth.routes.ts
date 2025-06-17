import express from 'express'
import { handleSignin, handleSignOut, handleSignUp, handleUploadProfile } from '../controllers/auth.controller'
import { protectRoute } from '../middleware/auth.middleare'

const router = express.Router()

router.post('/signin', handleSignin)
router.post('/signup', handleSignUp)
router.post('/signout', handleSignOut)

router.get("/upload-profile", protectRoute, handleUploadProfile)


export default router