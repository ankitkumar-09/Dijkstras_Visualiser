const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000', 
    methods: ['GET', 'POST']       
  }
});

io.on('connection', (socket) => {
  console.log('New user connected:', socket.id);

  socket.on('send_message', (data, respond) => {
    console.log('Got message:', data);
    
    if (!data.senderId || !data.receiverId || !data.message || !data.path) {
      console.log('Message missing info');
      respond({ ok: false, error: 'Missing data' });
      return;
    }

    socket.emit('receive_message', {
      from: data.senderId,
      message: data.message
    });

    respond({ ok: true });
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});
const port = 3001;
server.listen(port, () => {
  console.log(`Chat server running on port ${port}`);
});