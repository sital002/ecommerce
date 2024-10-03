import mongoose from "mongoose";

export const connectDB=async()=>{
    try {
        const dbInstance=await mongoose.connect(process.env.MONGO_URI as string)
        console.log("db string",dbInstance.connection.host)
    } catch (error:any) {
        console.log('failed to connect database',error.message);
        throw new Error(error?.message)
    }
}