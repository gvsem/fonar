import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';

import { Socket, Server } from 'socket.io';
import { Inject, Logger, UseGuards } from '@nestjs/common';
import { AuthRequiredGuard } from '../auth/guards/auth.required.guard';
import { Replique } from '../replique/replique.entity';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
  transports: ['polling'],
})
//@UseGuards(AuthRequiredGuard)
export class SocialBusGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;

  connections: { [key: string]: Socket } = {};

  private logger: Logger = new Logger('AppGateway');

  async notifyAboutNewReplique(r: Replique) {
    for (const rKey in this.connections) {
      this.logger.log('gonna notify: ' + rKey + ' about replique ' + r.id);
      this.connections[rKey].emit('notifyAboutNewReplique', r);
    }
  }

  afterInit(server: Server) {
    this.logger.log('Init');
  }

  async handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
    delete this.connections[client.id];
  }

  @UseGuards(AuthRequiredGuard)
  async handleConnection(client: Socket, ...args: any[]) {
    this.logger.log(`Client connected: ${client.id}`);
    this.connections[client.id] = client;
  }
}
