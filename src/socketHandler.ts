import { Server } from 'socket.io';
import http from 'http';

const port =  5040; // Use the dynamic port or fallback to 5040
const server = http.createServer(); // Create an HTTP server for the Socket.IO instance
const io = new Server(server, {
  cors: {
    origin: '*', // Allow all origins or specify your frontend URL
  },
});

io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  socket.on('subscribe', (userId) => {
    console.log(`User ${userId} subscribed to notifications`);
    socket.join(userId);
  });

  socket.on('unsubscribe', (userId) => {
    console.log(`User ${userId} unsubscribed from notifications`);
    socket.leave(userId);
  });

  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

// Start the server
server.listen(port, () => {
  console.log(`Socket.IO server running on port ${port}`);
});

export default io;
