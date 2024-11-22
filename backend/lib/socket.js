const http = require("http");
const cors = require("cors");
const express = require("express");
const app = express();
const server = http.createServer(app);
const onlineUsers = {};

const io = require("socket.io")(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});
function getReceiverSocketId(userId) {
  console.log(userSocketMap);

  return userSocketMap[userId];
}

// used to store online users
const userSocketMap = {}; // {userId: socketId}
io.on("connection", (socket) => {
  console.log("user connected...", socket.id);
  io.emit("getOnlineUsers", Object.keys(userSocketMap));
  socket.on("disconnect", () => {
    console.log("user connected...", socket.id);
  });
});
module.exports = { io, app, server, getReceiverSocketId };
