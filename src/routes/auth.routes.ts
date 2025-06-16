import express from 'express'
import { handleSignin, handleSignOut, handleSignUp } from '../controllers/auth.controller'

const router =express.Router()

router.post('/signin',handleSignin)
router.post('/signup',handleSignUp)
router.post('/signout',handleSignOut)


export default router