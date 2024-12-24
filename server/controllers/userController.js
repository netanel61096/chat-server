import User from "../models/userModel.js";
import Message from '../models/messageModel.js';
import Room from '../models/roomModel.js';
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken'


export const registerUser = async (req, res) => {
  const { username, email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new User({ username, email, password: hashedPassword });

  try {
    await user.save();
    res.status(201).json({ message: "user register successfully" });
  } catch (error) {
    res.status(400).json({ message: "Error registering user", error });
  }
};


export const loginUser = async (req, res) => {
    const { email, password } = req.body;
  
    try {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ message: "User not found" });
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        return res.status(400).json({ message: "Invalid credentials" });
      }
  
      const token = jwt.sign(
        { id: user._id, email: user.email ,name:user.username},
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );
  
      res.status(200).json({
        message: "Login successful",
        token,
        user: { id: user._id, name: user.username, email: user.email },
      });
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
};


export const getUserById = async (req, res) => {
    const {id} = req.params
  try {
    const user = await User.findById(id)
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Error fetching user", error });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, "-password"); 
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Error fetching users", error });
  }
};

export const updateUser = async (req, res) => {
  const { id } = req.params;
  const updates = req.body;
  try {

    const updatedUser = await User.findByIdAndUpdate(
      id,
      updates,
      { new: true, runValidators: true } 
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: "Error updating user", error: error.message });
  }
};
export const deleteUser = async (req, res) => {
  const { id } = req.params;

  try {

    const user = await User.findByIdAndDelete(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const deletedMessages = await Message.deleteMany({
      $or: [{ senderId: id }, { receiverId: id }],
    });

    const updatedRooms = await Room.updateMany(
      { participants: id },
      { $pull: { participants: id } }
    );

    const deletedRooms = await Room.deleteMany({ participants: { $size: 0 } });

    const orphanedMessages = await Message.aggregate([
      {
        $lookup: {
          from: "users", 
          localField: "senderId",
          foreignField: "_id",
          as: "senderDetails",
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "receiverId",
          foreignField: "_id",
          as: "receiverDetails",
        },
      },
      {
        $match: {
          $or: [
            { senderDetails: { $size: 0 } }, 
            { receiverDetails: { $size: 0 } }, 
          ],
        },
      },
    ]);

    const orphanedMessageIds = orphanedMessages.map((msg) => msg._id);
    const deletedOrphanedMessages = await Message.deleteMany({
      _id: { $in: orphanedMessageIds },
    });

    res.status(200).json({
      message: "User and related data deleted successfully",
      deletedMessages: deletedMessages.deletedCount,
      deletedOrphanedMessages: deletedOrphanedMessages.deletedCount,
      updatedRooms: updatedRooms.modifiedCount,
      deletedRooms: deletedRooms.deletedCount,
    });
  } catch (error) {
    res.status(500).json({ message: "Error deleting user", error: error.message });
  }
};


