import mongoose from "mongoose";

const roomSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, default: "" },
  createdBy: {type: mongoose.Schema.Types.ObjectId,ref: "User",required: true},
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

roomSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

const Room = mongoose.model("Room", roomSchema);

export default Room
