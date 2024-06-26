import express from "express"
import { getLoggedInUser, login, logout, signup } from "../controllers/authController.js"
import { protectedRoute } from "../middleware/protectedRoute.js"


const router = express.Router()

router.post("/signup", signup)

router.post("/login", login)

router.post("/logout", logout)

router.get("/me", protectedRoute, getLoggedInUser)



export default router;