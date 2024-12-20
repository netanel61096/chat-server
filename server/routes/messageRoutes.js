import express from "express";
import { createMessage, getMessagesByRoom, getPrivateMessages } from "../controllers/messageController.js";

const router = express.Router();

router.post("/", createMessage);                     
router.get("/room/:roomId", getMessagesByRoom);      
router.get("/private/:user1Id/:user2Id", getPrivateMessages); 

export default router;
