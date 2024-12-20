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

userSchema.pre("save", async function (next) {
    try {
     
      if (!this.isModified("password")) return next();
  
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt); // הצפנת הסיסמה
      next();
    } catch (err) {
      next(err); 
    }
  });
  
  // פונקציה להשוואת סיסמאות בזמן התחברות
  userSchema.methods.comparePassword = async function (candidatePassword) {
    try {
      return await bcrypt.compare(candidatePassword, this.password);
    } catch (err) {
      throw new Error("Error comparing passwords");
    }
  };

const User = mongoose.model('User',userSchema)
export default User
