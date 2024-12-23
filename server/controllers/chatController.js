import Room from "../models/roomModel.js";
import Message from "../models/messageModel.js";
import mongoose from "mongoose";

export const getChats = async (req, res) => {
  const userId = req.user.id;

  try {
    // מציאת חדרים שהמשתמש משתתף בהם עם ה-ID וה-username של המשתמשים
    const rooms = await Room.aggregate([
      {
        $match: { participants: new mongoose.Types.ObjectId(userId) }, // חדרים עם המשתמש המחובר
      },
      {
        $lookup: {
          from: "users", // חיבור לאוסף המשתמשים
          localField: "participants", // רשימת ה-ID של המשתתפים
          foreignField: "_id", // מזהי המשתמשים
          as: "participantDetails", // שם השדה החדש שייווצר
        },
      },
      {
        $project: {
          name: 1,
          description: 1,
          createdBy: 1,
          participants: {
            $map: {
              input: "$participantDetails",
              as: "participant",
              in: {
                id: "$$participant._id",
                username: "$$participant.username",
              },
            },
          }, // החלפת ה-ID והוספת ה-username
        },
      },
    ]);

    // מציאת צ'אטים פרטיים
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
            { roomId: null },
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
      {
        $match: {
          userDetails: { $ne: [] },
        },
      },
    ]);

    res.status(200).json({
      rooms,
      privateChats: privateChats.map((chat) => ({
        myId: userId,
        userId: chat._id,
        userName: chat.userDetails[0]?.username,
        lastMessage: chat.lastMessage,
        userDetails: chat.userDetails[0],
        timeSendLastMessage: chat.timestamp,
        type: "privateChat",
      })),
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching chats", error: error.message });
  }
};
