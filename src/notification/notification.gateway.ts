import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*', // Allow connections from any domain
    methods: ['GET', 'POST'],
  },
})
export class NotificationGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  // Log when the server starts
  onModuleInit() {
    console.log(
      '[NotificationGateway] WebSocket server started on ws://localhost:3000',
    );
  }

  // Store user socket connections
  private userSockets: Map<number, string> = new Map();

  // When a user connects
  handleConnection(client: Socket) {
    const userId = client.handshake.query.userId;
    if (userId) {
      this.userSockets.set(Number(userId), client.id); // Store the socket ID associated with the userId
      console.log(`User ${userId} connected with socket ID: ${client.id}`);
    }
  }

  // When a user disconnects
  handleDisconnect(client: Socket) {
    // Find and remove the user associated with the socket ID
    this.userSockets.forEach((socketId, userId) => {
      if (socketId === client.id) {
        this.userSockets.delete(userId);
        console.log(`User ${userId} disconnected`);
      }
    });
  }

  // Send notification to a specific user
  sendToUser(userId: number, payload: any) {
    const socketId = this.userSockets.get(userId);
    if (socketId) {
      this.server.to(socketId).emit('notification', payload);
      console.log(`Notification sent to user ${userId}:`, payload);
    } else {
      console.log(`User ${userId} is not connected`);
    }
  }
}
