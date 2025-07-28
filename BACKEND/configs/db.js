import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectDB = async () => {
  try {
    console.log("Connecting to MongoDB...");
    
    const conn = await mongoose.connect(process.env.MONGODB_URL, {
      serverSelectionTimeoutMS: 5000,
      maxPoolSize: 10
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("❌ MongoDB Connection Failed");
    console.error("Error Details:", error.message);
    console.log("Using Connection String:", 
      process.env.MONGODB_URL?.replace(/:\/\/.*@/, "://USERNAME:PASSWORD@")); // Masked log
    process.exit(1);
  }
};

export default connectDB;