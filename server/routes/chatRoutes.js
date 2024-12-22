import express from "express";
import { getChats } from "../controllers/chatController.js";
import { authenticateToken } from "../middleware/authenticateToken.js";

const router = express.Router();

router.get("/chats", authenticateToken, getChats);

export default router;
