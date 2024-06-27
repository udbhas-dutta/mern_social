import express from "express"
import { protectedRoute } from "../middleware/protectedRoute.js";
import { followUnfollowUser, getSuggestedUsers, getUserProfile, updateProfile } from "../controllers/userController.js";

const router = express.Router();

router.get("/profile/:username", protectedRoute, getUserProfile)
router.get("/suggested", protectedRoute, getSuggestedUsers)
router.post("/follow/:id", protectedRoute, followUnfollowUser)
router.post("/update", protectedRoute, updateProfile)

export default router