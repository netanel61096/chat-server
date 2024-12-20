import mongoose from 'mongoose';

// מחרוזת החיבור למונגו
const MONGO_URI = "mongodb://localhost:27017/chat-app";

// פונקציה לחיבור למסד הנתונים
const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("MongoDB connected successfully!");
  } catch (err) {
    console.error("Error connecting to MongoDB:", err.message);
    process.exit(1); // סיים את התהליך עם שגיאה
  }
};

export default connectDB
