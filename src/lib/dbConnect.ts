import mongoose from "mongoose";

type ConnectionObject = {// ts for type safety
    isConnected?: number;  //? means ddata is optional, if data comes it is of number
}

const connection: ConnectionObject = {}

async function dbConnect(): Promise<void> {
    if (connection.isConnected) {
        console.log("Already connected to db")
        return
    }
    try {
        const db = await mongoose.connect(process.env.MONGODB_URI || '', {})
        connection.isConnected = db.connections[0].readyState //something new
        console.log("DB connected successfully")
    } catch (error) {
        console.log('DB connection failed')
        console.error(error)
        process.exit(1)
    }
}

export default dbConnect;