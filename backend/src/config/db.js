import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected");
    return true;
  } catch (error) {
    console.log("MongoDB connection failed. Continuing in demo mode.");
    console.log(error.message);
    return false;
  }
};

export default connectDB;
