const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // User joins a room
  socket.on("joinRoom", ({ username, room }) => {
    socket.join(room);
    socket.username = username;
    socket.room = room;

    // Notify others in room
    socket.to(room).emit("message", {
      user: "System",
      text: `${username} joined the room`,
    });
  });

  // Receive message
  socket.on("sendMessage", (message) => {
    io.to(socket.room).emit("message", {
      user: socket.username,
      text: message,
    });
  });

  socket.on("disconnect", () => {
    if (socket.room) {
      socket.to(socket.room).emit("message", {
        user: "System",
        text: `${socket.username} left the room`,
      });
    }
  });
});

server.listen(5000, () => {
  console.log("Server running on port 5000");
});
