import Notification from "../models/notifModel.js";
import Post from "../models/postModel.js";
import User from "../models/userModel.js";

import { v2 as cloudinary } from "cloudinary"

export const createPost = async (req, res) => {
    try {
        const { text, img } = req.body;
        const userId = req.user._id.toString();

        const user = await User.findById(userId);
        if (!user) return res.status(400).json({ message: "user not found" });

        if (!text && !img) {
            return res.status(400).json({ message: "post must have a text or an image" });
        }

        let imageUrl = null;
        if (img) {
            try {
                const uploadResponse = await cloudinary.uploader.upload(img, {
                    folder: "posts"
                });
                // console.log("Cloudinary Upload Response:", uploadResponse); 
                imageUrl = uploadResponse.secure_url;
            } catch (uploadError) {
                console.error("Error uploading image to Cloudinary:", uploadError);
                return res.status(500).json({ message: "Error uploading image" });
            }
        }

        const newPost = new Post({
            user: userId,
            text,
            img: imageUrl
        });

        await newPost.save();
        res.status(201).json(newPost);
    } catch (error) {
        console.error("Error creating post:", error); // Log the error for debugging
        res.status(500).json({ error: error.message });
    }
};

export const deletePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
        if (!post) {
            return res.status(404).json({ message: "Post not found" })
        }

        if (post.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: "you are not authorized to delete this post" })
        }

        if (post.img) {
            const imgId = post.img.split("/").pop().split(".")[0]
            await cloudinary.uploader.destroy(`posts/${imgId}`,{
                invalidate: true,
                resource_type: "image",
            }).then(result => console.log(result))
        }

        await Post.findByIdAndDelete(req.params.id)

        res.status(200).json({ message: "post deleted successfully" })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

export const commentPost = async (req, res) => {
    try {
        const postId = req.params.id
        const { text } = req.body
        const userId = req.user._id

        if (!text) {
            return res.status(400).json({ message: "text field is required" })
        }

        const post = await Post.findById(postId)

        if (!post) {
            return res.status(404).json({ error: "post not found" })
        }

        const comment = { user: userId, text }

        post.comments.push(comment)
        await post.save();

        res.status(200).json(post)

    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

export const likeUnlikePost = async (req, res) => {
    try {
        const userId = req.user._id;
        const { id: postId } = req.params

        const post = await Post.findById(postId)

        if (!post) {
            res.status(404).json({ error: "Post not found" })
        }

        const userLikedPost = post.likes.includes(userId)
        if (userLikedPost) {
            //unlike post
            await Post.updateOne({ _id: postId }, { $pull: { likes: userId } })
            await User.updateOne({ _id: userId }, { $pull: { likedPosts: postId } })
            res.status(200).json({ message: "post unliked successfully" })
        } else {
            //like post
            post.likes.push(userId)
            await User.updateOne({ _id: userId }, { $push: { likedPosts: postId } })
            await post.save()

            const notification = new Notification({
                from: userId,
                to: post.user,
                type: "like"
            })
            await notification.save()

            res.status(200).json({ message: "post liked successfully" })
        }
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

export const getAllPosts = async (req, res) => {
    try {
        const posts = await Post.find().sort({ createdAt: -1 }).populate({
            path: "user",
            select: "-password"
        })
            .populate({
                path: "comments.user",
                select: "-password"
            })

        if (posts.length === 0) {
            return res.status(200).json([])
        }

        res.status(200).json(posts)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

export const getLikedPosts = async (req, res) => {

    const userId = req.params.id

    try {
        const user = await User.findById(userId)
        if (!user) {
            return res.status(404).json({ error: "user not found" })
        }

        const likedPosts = await Post.find({ _id: { $in: user.likedPosts } })
            .populate({
                path: "user",
                select: "-password"
            }).populate({
                path: "comments.user",
                select: "-password"
            })

        res.status(200).json(likedPosts)
    } catch (error) {

    }
}

export const getFollowingPosts = async (req, res) => {
    try {
        const userId = req.user._id
        const user = await User.findById(userId)
        if (!user) return res.status(404).json({ error: "user not found" })

        const following = user.following
        const feedPosts = await Post.find({ user: { $in: following } })
            .sort({ createdAt: -1 })
            .populate({
                path: "user",
                select: "-password",
            }).populate({
                path: "comments.user",
                select: "-password"
            })
        res.status(200).json(feedPosts)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

export const getUserPosts = async (req, res) => {
    try {
        const { username } = req.params

        const user = await User.findOne({ username })
        if (!user) return res.status(404).json({ message: "user not found" })

        const posts = await Post.find({ user: user._id }).sort({ createdAt: -1 }).populate({
            path: "user",
            select: "-password"
        }).populate({
            path: "comments.user",
            select: "-password"
        })
        return res.status(200).json(posts)
    } catch (error) {
        res.status(500).json({error: error.message})
    }
}