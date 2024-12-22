import Room from "../models/roomModel.js";
import Message from "../models/messageModel.js";

export const getChats = async (req, res) => {
  const userId = req.user.id; // מתוך ה-Token (המשתמש המחובר)

  try {
    // 1. מציאת חדרים שהמשתמש הוא משתתף בהם
    const rooms = await Room.find({ participants: userId });

    // 2. מציאת צ'אטים פרטיים (משתמשים שהייתה איתם תקשורת)
    const privateChats = await Message.aggregate([
      {
        $match: {
          $or: [{ sender: userId }, { receiver: userId }],
        },
      },
      {
        $group: {
          _id: {
            $cond: [
              { $eq: ["$sender", userId] },
              "$receiver",
              "$sender",
            ],
          },
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

    // 3. החזרת הנתונים
    res.status(200).json({
      rooms,
      privateChats: privateChats.map((chat) => ({
        userId: chat._id,
        userDetails: chat.userDetails[0],
      })),
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching chats", error });
  }
};
