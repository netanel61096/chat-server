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
// יצירת שרת HTTP
const server = http.createServer(app);

// חיבור Socket.IO לשרת
const io = new Server(server, {
    cors: {
        origin: "*", // כתובת ה-Frontend
        methods: ["GET", "POST"],
    },
});

// ניהול אירועים של Socket.IO
io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);

    // האזנה לאירוע הצטרפות לחדר
    socket.on("join_room", (roomId) => {
        socket.join(roomId); // המשתמש מצטרף לחדר
        console.log(`User ${socket.id} joined room ${roomId}`);
    });

    socket.on("leave_room", () => {
        socket.rooms.forEach(v => {
            socket.leave(v); // המשתמש עוזב חדר
        }

        )
        console.log(`User ${socket.id} leaveed all rooms`);
    });


    // האזנה להודעות מהלקוח
    socket.on("send_message", (data) => {
        const { roomId, content, receiverId, senderId } = data;

        const createUniqueRoomId = (userId1, userId2) => {
            // מיון ה-IDs בסדר אלפביתי כדי לשמור על אחידות
            const sortedIds = [userId1, userId2].sort();
            // יצירת מזהה ייחודי על ידי חיבור ה-IDs
            return `${sortedIds[0]}_${sortedIds[1]}`;
          };

        console.log(`Message received in room ${roomId|| receiverId}:`, content);

        // שליחת ההודעה לכל הלקוחות בחדר
        if (roomId) {
            io.to(roomId).emit("receive_message", data); // שליחת הודעה לחדר
            console.log(roomId);

        }
        else if (receiverId){
            io.to(createUniqueRoomId(receiverId, senderId)).emit("receive_message", data); // שליחת הודעה לחדר
            console.log(receiverId,senderId);
        }
        else {
            console.error("Room ID or receiverId is missing in the message data");
        }
    });

    // ניתוק
    socket.on("disconnect", () => {
        console.log("A user disconnected:", socket.id);
    });
});
// הפעלת השרת
server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
