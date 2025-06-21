import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config({
  path: ".env", // Load environment variables from .env file
});

const connectDB = async () => {
  try {
    const connectionInstant = await mongoose.connect(
      `${process.env.MONGODB_URI}`,
    );
    console.log(
      ` \n Connected to MongoDB at ${connectionInstant.connection.host}:${connectionInstant.connection.port}`,
    ); // Log the host and port of the MongoDB connection
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    throw error;
    process.exit(1);
  }
};

export default connectDB;
