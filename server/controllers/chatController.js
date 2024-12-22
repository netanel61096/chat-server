import Room from "../models/roomModel.js";
import Message from "../models/messageModel.js";
import mongoose from 'mongoose'

export const getChats = async (req, res) => {
  const userId = req.user.id; // מתוך ה-Token (המשתמש המחובר)

  try {
    // 1. מציאת חדרים שהמשתמש הוא משתתף בהם
    const rooms = await Room.find({ participants: userId });

    // 2. מציאת צ'אטים פרטיים (משתמשים שהייתה איתם תקשורת)
    console.log("User ID:", userId);
    const messages = await Message.find({
      $or: [{ senderId: userId }, { receiverId: userId }],
    });
    console.log("Messages:", messages);
    const privateChats = await Message.aggregate([
      {
        $match: {
          $and: [
            {
              $or: [
                { senderId: new mongoose.Types.ObjectId(userId) },
                { receiverId: new mongoose.Types.ObjectId(userId) },
              ],
            },
            { roomId: null }, // סינון הודעות פרטיות בלבד
          ],
        },
      },
      {
        $group: {
          _id: {
            $cond: [
              { $eq: ["$senderId", new mongoose.Types.ObjectId(userId)] },
              "$receiverId",
              "$senderId",
            ],
          },
          lastMessage: { $last: "$content" },
          timestamp: { $last: "$createdAt" },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "userDetails",
        },
      },
    ]);
    
    console.log("Private Chats:", privateChats);
    
    
    

    // 3. החזרת הנתונים
    res.status(200).json({
      rooms,
      privateChats: privateChats.map((chat) => ({
        myId:userId,
        userId: chat._id,
        userName:chat.username,
        lastMessage:chat.lastMessage,
        userDetails: chat.userDetails[0],
        timeSendLastMesagge:chat.timestamp,
        type:"privateChat"
      })),
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching chats", error: error.message  });
  }
};
