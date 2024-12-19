const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const mongoose = require("mongoose");

const app = express();
const server = http.createServer(app);


server.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
