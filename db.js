import mongoose from 'mongoose';


const MONGO_URI = "mongodb://localhost:27017/chat-app";

const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("MongoDB connected successfully!");
  } catch (err) {
    console.error("Error connecting to MongoDB:", err.message);
    process.exit(1); 
  }
};

export default connectDB
