
import messageModel from "../models/messageModel.js";
import userModel from "../models/userModel.js";
import roomModel from "../models/roomModel.js";

// יצירת הודעה חדשה
export const createMessage = async (req, res) => {
  const { senderId, receiverId, roomId, content } = req.body;

  try {
    // 1. בדיקה ששדה 'content' לא ריק
    if (!content || content.trim() === "") {
      return res.status(400).json({ message: "Message content cannot be empty" });
    }

    // 2. בדיקה ששדה 'senderId' לא ריק
    if (!senderId || senderId.trim() === "") {
      return res.status(400).json({ message: "Sender ID is required" });
    }

    // 3. בדיקה שאו receiverId או roomId קיים
    if (!receiverId && !roomId) {
      return res.status(400).json({ message: "Either receiverId or roomId is required" });
    }

    // 4. בדיקה שהשולח קיים
    const sender = await userModel.findById(senderId);
    if (!sender) {
      return res.status(404).json({ message: "Sender not found" });
    }

    // 5. בדיקה שהנמען או החדר קיימים
    if (receiverId) {
      const receiver = await userModel.findById(receiverId);
      if (!receiver) {
        return res.status(404).json({ message: "Receiver not found" });
      }
    }

    if (roomId) {
      const room = await roomModel.findById(roomId);
      if (!room) {
        return res.status(404).json({ message: "Room not found" });
      }
    }

    // 6. יצירת הודעה חדשה
    const newMessage = new messageModel({
      senderId,
      receiverId: receiverId || null,
      roomId: roomId || null,
      content,
    });

    await newMessage.save();
    res.status(201).json({ message: "Message sent successfully", newMessage });
  } catch (error) {
    res.status(500).json({ message: "Error sending message", error });
  }
};


// שליפת הודעות לפי חדר
export const getMessagesByRoom = async (req, res) => {
  const { roomId } = req.params;

  try {
    const messages = await messageModel.find({ roomId }).sort({ createdAt: 1 });
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ message: "Error fetching messages", error });
  }
};

// שליפת הודעות פרטיות בין שני משתמשים
export const getPrivateMessages = async (req, res) => {
  const { user1Id, user2Id } = req.params;

  try {
    const messages = await messageModel.find({
      $or: [
        { senderId: user1Id, receiverId: user2Id },
        { senderId: user2Id, receiverId: user1Id },
      ],
    }).sort({ createdAt: 1 });

    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ message: "Error fetching private messages", error });
  }
};
