import mongoose from "mongoose";
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema({
  username: { type: String, require: true },
  email: {type:String , require : true, unique: true, lowercase:true},
  password: {type: String,required: true },
  status: {type: String,enum: ["online", "offline", "away"],default: "offline"},
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
 
});

userSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});



const User = mongoose.model('User',userSchema)
export default User
