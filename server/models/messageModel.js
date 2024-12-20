import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  senderId: {type: mongoose.Schema.Types.ObjectId,ref: "User", required: true},
  receiverId: {type: mongoose.Schema.Types.ObjectId, ref: "User", default: null},
  roomId: {type: mongoose.Schema.Types.ObjectId, ref: "Room", default: null},
  content: {type: String, required: true,trim: true },
  deliveredAt: { type: Date, default: Date.now },
  readBy: [
    {
      userId: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
      readAt: { type: Date }, 
    },
  ],
  isEdited: {type: Boolean, default: false },
  isDeleted: {type: Boolean, default: false },
  createdAt: {type: Date, default: Date.now },
});

const Message = mongoose.model("Message", messageSchema);

export default Message
