import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';

import { PrismaService } from '../../prisma/prisma.service';
import { AuthService } from '../auth/auth.service';

@WebSocketGateway({
  namespace: '/ws/notifications',
  cors: { origin: '*' },
})
export class NotificationGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;
  private logger = new Logger('NotificationGateway');

  constructor(
    private readonly prisma: PrismaService,
    private readonly authService: AuthService,
  ) {}

  async handleConnection(client: Socket) {
    // debug: show handshake
    this.logger.debug(`handleConnection client.handshake.auth: ${JSON.stringify(client.handshake.auth ?? {})}`);

    // extract token (auth preferred)
    const token = client.handshake?.auth?.token ?? client.handshake?.query?.token;
    if (!token || typeof token !== 'string') {
      this.logger.warn(`No token provided - disconnecting socket ${client.id}`);
      // FIX 1: Change reserved 'connect_error' to custom 'auth_error'
      client.emit('auth_error', { message: 'Unauthorized: No token provided' });
      client.disconnect(true);
      return;
    }

    // validate token using your AuthService helper
    const user = await this.authService.validateToken(token);

    // debug log validated user
    this.logger.debug('handleConnection validated user: ' + JSON.stringify(user ?? null));

    if (!user || !user.id) {
      this.logger.warn(`Invalid token for socket ${client?.id} - disconnecting`);
      // FIX 2: Change reserved 'connect_error' to custom 'auth_error'
      client.emit('auth_error', { message: 'Unauthorized: Invalid token' });
      client.disconnect(true);
      return;
    }

    // attach sanitized user object to socket.data for later use
    client.data.user = user;

    this.logger.log(`Socket connected: ${client.id} | User=${user.id} (${user.email})`);

    // join user's private room
    const roomName = this.getUserRoom(user.id);
    await client.join(roomName);
    this.logger.debug(`User ${user.id} joined room: ${roomName}`);
  }

  async handleDisconnect(client: Socket) {
    // If client.data.user is set, the user was authenticated. If not, it means the disconnect happened before or during validation.
    const user = client.data?.user;
    this.logger.log(`Socket disconnected: ${client.id} | User=${user?.id ?? 'UNAUTHORIZED'}`);
  }

  getUserRoom(userId: string) {
    return `user:${userId}`;
  }

  // method to emit notifications from server-side
  public sendToUser(userId: string, event: string, payload: any) {
    const roomName = this.getUserRoom(userId);
    this.server.of('/ws/notifications').to(roomName).emit(event, payload);
    this.logger.verbose(`Sent event '${event}' to user room: ${roomName}`);
  }
}