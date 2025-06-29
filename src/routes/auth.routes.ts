import express from 'express'
import { handleCheckAuth, handleSignin, handleSignOut, handleSignUp, handleUploadProfile } from '../controllers/auth.controller'
import { protectRoute } from '../middleware/auth.middleare'

const router = express.Router()

router.post('/signin', handleSignin)
router.post('/signup', handleSignUp)
router.post('/signout', handleSignOut)

router.put("/upload-profile", protectRoute, handleUploadProfile)

router.get('/check',protectRoute,handleCheckAuth)


export default router