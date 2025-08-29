import expess from "express"
import { login, signup, logout } from "../controllers/auth.controller.js"

const router = expess.Router()

router.post('/signup', signup)

router.post('/login', login)

router.post('/logout', logout)

export default router