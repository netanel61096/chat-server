import User from "../models/userModel.js";
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken'


//פונקצייה להירשמות
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

//פונקציה להתחברות
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
        { id: user._id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );
  
      res.status(200).json({
        message: "Login successful",
        token,
        user: { id: user._id, name: user.username, email: user.email },
      });
    } catch (error) {
      res.status(500).json({ message: "Server error", error });
    }
};

//user פונקציה לשליפת 

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
//users פונקציה לשליפת 
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, "-password"); 
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Error fetching users", error });
  }
};



