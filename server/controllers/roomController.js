import Room from "../models/roomModel.js";
import User from "../models/userModel.js";


// יצירת חדר חדש
export const createRoom = async (req, res) => {
  const { name, description, createdBy } = req.body;

  try {
    const user = await User.findById(createdBy);
    if (!user) {
      return res.status(404).json({ message: "User who creates the room not found" });
    }
    const newRoom = new Room({
      name,
      description,
      createdBy,
      participants: [createdBy], // יוצר החדר נוסף כברירת מחדל
    });

    await newRoom.save();
    res.status(201).json({ message: "Room created successfully", newRoom });
  } catch (error) {
    res.status(400).json({ message: "Error creating room", error });
  }
};

// שליפת כל החדרים
export const getAllRooms = async (req, res) => {
  try {
    const rooms = await Room.find().populate("createdBy").populate("participants");
    res.status(200).json(rooms);
  } catch (error) {
    res.status(500).json({ message: "Error fetching rooms", error });
  }
};

// שליפת חדר לפי ID
export const getRoomById = async (req, res) => {
  const { id } = req.params;

  try {
    const room = await Room.findById(id).populate("createdBy").populate("participants");
    if (!room) return res.status(404).json({ message: "Room not found" });

    res.status(200).json(room);
  } catch (error) {
    res.status(500).json({ message: "Error fetching room", error });
  }
};

// עדכון חדר
export const updateRoom = async (req, res) => {
  const { id } = req.params;

  try {
    const updatedRoom = await Room.findByIdAndUpdate(id, req.body, { new: true });
    if (!updatedRoom) return res.status(404).json({ message: "Room not found" });

    res.status(200).json({ message: "Room updated successfully", updatedRoom });
  } catch (error) {
    res.status(400).json({ message: "Error updating room", error });
  }
};

// מחיקת חדר
export const deleteRoom = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedRoom = await Room.findByIdAndDelete(id);
    if (!deletedRoom) return res.status(404).json({ message: "Room not found" });

    res.status(200).json({ message: "Room deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting room", error });
  }
};

// הוספת משתמש לחדר
export const addUserToRoom = async (req, res) => {
    const { roomId } = req.params; // מזהה החדר
    const { userId } = req.body;   // מזהה המשתמש להוספה
  
    try {
      // 1. בדוק שהחדר קיים
      const room = await Room.findById(roomId);
      if (!room) {
        return res.status(404).json({ message: "Room not found" });
      }
  
      // 2. בדוק שהמשתמש קיים
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      // 3. הוספת המשתמש לרשימת המשתתפים אם הוא לא קיים שם
      if (!room.participants.includes(userId)) {
        room.participants.push(userId);
        await room.save();
        return res.status(200).json({ message: "User added to room", room });
      } else {
        return res.status(400).json({ message: "User already in the room" });
      }
    } catch (error) {
      res.status(500).json({ message: "Error adding user to room", error });
    }
  };
  
