import express from "express"
import dotenv from "dotenv"

import authRoutes from "./routes/authRoutes.js"
import connectMongo from "./db/connectMongo.js";

dotenv.config();

const app = express()
const port = process.env.PORT || 8000


app.use("/api/auth", authRoutes)

app.listen(port, () => {
    console.log(`Server running on port ${port}`)
    connectMongo()
})