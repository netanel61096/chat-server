import express from "express";
import { createRoom, getAllRooms, getRoomById, updateRoom, deleteRoom, addUserToRoom } from "../controllers/roomController.js";

const router = express.Router();

router.post("/", createRoom);              
router.get("/", getAllRooms);             
router.get("/:id", getRoomById);          
router.put("/:id", updateRoom);           
router.delete("/:id", deleteRoom);        
router.post("/:roomId/add-user", addUserToRoom)

export default router;
