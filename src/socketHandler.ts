import { Server } from 'socket.io';

const io = new Server(5001, {
  cors: {
    origin: '*',
  },
});

io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  socket.on('subscribe', (userId: string) => {
    console.log(`User ${userId} subscribed to notifications`);
    socket.join(userId);
  });

  socket.on('unsubscribe', (userId: string) => {
    console.log(`User ${userId} unsubscribed from notifications`);
    socket.leave(userId);
  });

  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

export default io;
