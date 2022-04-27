import {
  MessageBody,
  OnGatewayConnection, OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer
} from "@nestjs/websockets";

import { Socket, Server } from 'socket.io';
import { Inject, Logger, UseGuards } from "@nestjs/common";
import { SocialbusGuard } from "./guards/socialbus.guard";
import { getSessionInformation } from "supertokens-node/lib/build/recipe/session";
import { UserService } from "../user/user.service";
import { User } from "../user/user.entity";

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})

export class SocialBusGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {

  @Inject(UserService) userService: UserService;
  @WebSocketServer() server: Server;

  connections : { [key:string]: Socket; } = {};


  private logger: Logger = new Logger('AppGateway');

  // @UseGuards(SocialbusGuard)
  // @SubscribeMessage('notifyNewVisitor')
  // handleMessage(client: Socket, payload: string): void {
  //   this.server.emit('notifyComment', payload);
  //
  // }

  notifyVisitor(userId: number, user: User) {
    if (this.connections[userId] !== undefined) {
      this.connections[userId].send('notifyNewVisitor', user.authorAlias);
    }
  }

  afterInit(server: Server) {
    this.logger.log('Init');
  }

  async handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);

    const token = client.handshake.headers.authorization.split(" ")[1];
    const s = await getSessionInformation(token);
    const u = await this.userService.getUserByAuthId(s.userId);

    delete this.connections[u.id];
  }

  async handleConnection(client: Socket, ...args: any[]) {
    this.logger.log(`Client connected: ${client.id}`);

    const token = client.handshake.headers.authorization.split(" ")[1];
    const s = await getSessionInformation(token);
    const u = await this.userService.getUserByAuthId(s.userId);

    this.connections[u.id] = client;

  }
}