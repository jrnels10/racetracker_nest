import {
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayInit,
  WsResponse,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Socket, Server } from 'socket.io';
import { GetUser } from 'src/auth/get-user.decorator';
import { User } from 'src/auth/user.entity';

@WebSocketGateway()
export class TrackerGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  public markers = [];
  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  handleConnection(client: Socket, ...args: any[]) {
    this.logger.log(`Client connected: ${client.id}`);
    client.emit('marker', this.markers); // emits all locations when client connects
  }

  @WebSocketServer() wss: Server;
  private logger: Logger = new Logger('LocationGateway');
  afterInit(server: Server) {
    this.logger.log('Initialized!');
  }

  @SubscribeMessage('marker') //receives the marker from the client and emits it to all users.
  handleEvent(client: Socket, data: any): void {
    console.log(data);
    this.markers = [data];
    this.wss.emit('marker', this.markers);
  }
}
