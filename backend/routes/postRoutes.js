import express from "express"
import { protectedRoute } from "../middleware/protectedRoute.js"
import { commentPost, createPost, deletePost, getAllPosts, getFollowingPosts, getLikedPosts, getUserPosts, likeUnlikePost } from "../controllers/postController.js"



const router = express.Router()

router.post("/create", protectedRoute, createPost)
router.get("/all", protectedRoute, getAllPosts)
router.get("/following", protectedRoute, getFollowingPosts)
router.get("/likes/:id", protectedRoute, getLikedPosts)
router.get("/user/:username", protectedRoute, getUserPosts)
router.post("/like/:id", protectedRoute, likeUnlikePost)
router.post("/comment/:id", protectedRoute, commentPost)
router.delete("/:id", protectedRoute, deletePost)



export default router