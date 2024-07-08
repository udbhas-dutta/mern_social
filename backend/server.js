import express from "express"
import dotenv from "dotenv"
import cookieParser from "cookie-parser"
import connectMongo from "./db/connectMongo.js";
import { v2 as cloudinary } from "cloudinary"
import cors from 'cors'

import authRoutes from "./routes/authRoutes.js"
import userRoutes from "./routes/userRoutes.js"
import postRoutes from "./routes/postRoutes.js"
import notificationRoutes from "./routes/notifRoutes.js"


dotenv.config();


cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
})


const app = express()
const port = process.env.PORT || 5000

app.use(cors({
    origin: 'http://localhost:3000',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true
}));

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }))

app.use(cookieParser())

app.use("/api/auth", authRoutes)
app.use("/api/users", userRoutes)
app.use("/api/posts", postRoutes)
app.use("/api/notifications", notificationRoutes)

app.listen(port, () => {
    console.log(`Server running on port ${port}`)
    connectMongo()
})