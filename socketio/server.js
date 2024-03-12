import express from 'express';
import http from 'http';
import { Server as SocketIo } from 'socket.io';
import cors from "cors"

const app = express();
const server = http.createServer(app);
const io = new SocketIo(server,{
    cors: {
      origin: "http://localhost:5173",
      methods: ["GET", "POST"], 
      credentials: true 
    }
  });

// Store rooms and their participants
const rooms = {};

io.on('connection', (socket) => {
  console.log('A user connected');

  // Create or join a room
  socket.on('joinRoom', (roomId) => {
    if (!rooms[roomId]) {
      rooms[roomId] = [socket.id];
      socket.join(roomId);
    } else {
      rooms[roomId].push(socket.id);
      socket.join(roomId);
      io.to(roomId).emit('roomParticipants', rooms[roomId]);
    }
  });

  // Broadcast messages within the room
  socket.on('sendMessage', (roomId, message) => {
    console.log(message)
    io.to(roomId).emit('message', message);
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('A user disconnected');
    for (const roomId in rooms) {
      const index = rooms[roomId].indexOf(socket.id);
      if (index !== -1) {
        rooms[roomId].splice(index, 1);
        io.to(roomId).emit('roomParticipants', rooms[roomId]);
        if (rooms[roomId].length === 0) {
          delete rooms[roomId];
        }
      }
    }
  });
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});