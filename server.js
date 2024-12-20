import userRoutes from './server/routes/userRoutes.js';
import roomRoutes from './server/routes/roomRoutes.js';
import messageRoutes from './server/routes/messageRoutes.js'
import express from 'express';
import connectDB from './db.js';


const PORT = process.env.PORT || 4000;


connectDB(); 

const app = express();
app.use(express.json())


app.use('/api/users',userRoutes)
app.use('/api/rooms',roomRoutes)
app.use('/api/messages', messageRoutes);

 

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
