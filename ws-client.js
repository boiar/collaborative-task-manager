const { io } = require('socket.io-client');

// Test with userId=123
const userId = 1;

// Connect to NotificationGateway at http://localhost:3000
const socket = io('http://localhost:3000', {
  query: { userId },
  transports: ['websocket'],
});

// Connection success
socket.on('connect', () => {
  console.log('✅ Connected to NotificationGateway');
});

// Handle disconnect
socket.on('disconnect', (reason) => {
  console.log(`❌ Disconnected: ${reason}`);
});

// Listen for 'notification' event
socket.on('notification', (data) => {
  console.log('📬 Received notification:', data);
});

// Optional: Send a test event to the server
setTimeout(() => {
  socket.emit('testEvent', { message: 'Hello from client' });
}, 2000);

// Optional: Join or emit custom events
setTimeout(() => {
  socket.emit('moveCard', {
    cardId: 1,
    listId: 2,
    boardId: 3,
  });
}, 4000);
