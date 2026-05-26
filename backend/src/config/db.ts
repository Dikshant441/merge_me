import mongoose from "mongoose";
import "dotenv/config";

const connectDB = async (): Promise<void> => {
  await mongoose.connect(process.env.MONGODB_URI as string);
  console.log("Connected to MongoDB database");
};

export default connectDB;
