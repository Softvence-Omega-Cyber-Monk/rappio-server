import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Injectable, Logger } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

interface JwtPayload {
  sub?: string;
  id?: string;
  [key: string]: any;
}

//@WebSocketGateway({ namespace: '/ws/notifications', cors: { origin: '*' } })
@WebSocketGateway( {namespace: '/ws/notifications', cors: { origin: '*' } })
export class NotificationGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  public server: Server;

  private readonly logger = new Logger(NotificationGateway.name);

  afterInit(server: Server) {
    this.logger.log('Notification gateway initialized');

    // middleware to validate JWT and attach userId to socket.data
    server.use((socket: Socket, next) => {
      try {
        const token = socket.handshake.auth?.token;
        console.log("NotificationGateway token--------------------->", token);
        if (!token) return next(); // allow anonymous

        const secret = process.env.JWT_SECRET;
        if (!secret) throw new Error('JWT_SECRET is not defined');

        // jwt.verify can return string | object, cast to JwtPayload
        const payload = jwt.verify(token, secret) as JwtPayload;

        socket.data.userId = payload.sub ?? payload.id ?? null;

        return next();
      } catch (err) {
        this.logger.warn('WebSocket auth failed', err);
        // uncomment to reject unauthorized
        // return next(new Error('unauthorized'));
        return next();
      }
    });
  }

  handleConnection(socket: Socket) {
    const userId = socket.data.userId as string | undefined;
    if (userId) {
      const room = `user:${userId}`;
      socket.join(room);
      this.logger.log(`Socket ${socket.id} connected and joined ${room}`);
    } else {
      this.logger.log(`Socket ${socket.id} connected (unauthenticated)`);
    }
    socket.emit('connected', { socketId: socket.id });
  }

  handleDisconnect(socket: Socket) {
    this.logger.log(`Socket ${socket.id} disconnected`);
  }

  public sendToUser(userId: string, event: string, payload: any) {
    const room = `user:${userId}`;
    this.server.to(room).emit(event, payload);
    this.logger.debug(`Emitted ${event} to ${room}`);
  }

  public broadcast(event: string, payload: any) {
    this.server.emit(event, payload);
  }
}
