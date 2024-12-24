import express from 'express';
import cors from "cors";
import connectDB from './db.js';
import dotenv from "dotenv";
import http from 'http';
import { Server } from 'socket.io';

import userRoutes from './server/routes/userRoutes.js';
import roomRoutes from './server/routes/roomRoutes.js';
import messageRoutes from './server/routes/messageRoutes.js';
import chatRoutes from './server/routes/chatRoutes.js'
import { log } from 'console';

const PORT = process.env.PORT || 4000;


dotenv.config();
connectDB();

const app = express();

app.use(cors({
    origin: "*", // כתובת ה-Frontend שמורשה לגשת לשרת
    methods: ["GET", "POST", "PUT", "DELETE"], // שיטות HTTP שמורשות
    credentials: true, // אם נדרש לשלוח עוגיות או פרטי התחברות
}));

app.use(express.json())


app.use('/api/users', userRoutes)
app.use('/api/rooms', roomRoutes)
app.use('/api/messages', messageRoutes);
app.use('/api', chatRoutes);

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "*", 
        methods: ["GET", "POST"],
    },
});


io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);

    socket.on("join_room", (roomId) => {
        socket.join(roomId); 
        console.log(`User ${socket.id} joined room ${roomId}`);
    });

    socket.on("leave_room", () => {
        socket.rooms.forEach(v => {
            socket.leave(v); 
        }

        )
        console.log(`User ${socket.id} leaveed all rooms`);
    });



    socket.on("send_message", (data) => {
        const { roomId, content, receiverId, senderId } = data;

        const createUniqueRoomId = (userId1, userId2) => {
            const sortedIds = [userId1, userId2].sort();
            return `${sortedIds[0]}_${sortedIds[1]}`;
          };

        console.log(`Message received in room ${roomId|| receiverId}:`, content);

        if (roomId) {
            io.to(roomId).emit("receive_message", data);
            console.log(roomId);

        }
        else if (receiverId){
            io.to(createUniqueRoomId(receiverId, senderId)).emit("receive_message", data); 
            console.log(receiverId,senderId);
        }
        else {
            console.error("Room ID or receiverId is missing in the message data");
        }
    });


    socket.on("disconnect", () => {
        console.log("A user disconnected:", socket.id);
    });
});

server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
