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


app.use('/api/users',userRoutes)
app.use('/api/rooms',roomRoutes)
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

  // האזנה להודעות מהלקוח
  socket.on("send_message", (data) => {
    console.log("Message received:", data);

    // שליחת ההודעה לכל הלקוחות
    io.emit("receive_message", data);
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
