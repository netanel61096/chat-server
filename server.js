import userRoutes from './routes/userRoutes'

const express = require("express");
const connectDB = require("./db"); 
const PORT = process.env.PORT || 4000;


connectDB(); 

const app = express();
app.use(express.json())


app.use('/api/users',userRoutes)
 

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
