import mongoose from "mongoose"


const connectMongo = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI)
        console.log(`MongoDB connected: ${conn.connection.host}`)
    } catch (error) {
        console.error(`Error connecting to mongoDB: ${error.message}`)
        process.exit(1)
    }
}

export default connectMongo