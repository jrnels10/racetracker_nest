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
import { TrackerService } from './tracker.service';

const sampleUsers = [
  [
    {
      altitude: 0,
      heading: 205.7513427734375,
      latitude: 33.3641097,
      longitude: -112.3193377,
      altitudeAccuracy: 0.5,
      speed: 4.465692520141602,
      accuracy: 5,
    },
    {
      id: 4,
      email: 'jrnels40@gmail.com',
      firstName: 'coco',
      lastName: 'bean',
      role: 'COMPETITOR',
      password: '$2a$10$uDg8RXPpoXkYPp82R/Y1VuZxpkfz77qGqTRheBOHT5bjxSEo21K0u',
      salt: '$2a$10$uDg8RXPpoXkYPp82R/Y1Vu',
      events: [],
    },
  ],
  [
    {
      altitude: 0,
      heading: 205.7513427734375,
      latitude: 33.3641097,
      longitude: -112.3193377,
      altitudeAccuracy: 0.5,
      speed: 4.465692520141602,
      accuracy: 5,
    },
    {
      id: 1,
      email: 'jrnels123@gmail.com',
      firstName: 'esme',
      lastName: 'ureno',
      role: 'COMPETITOR',
      password: '$2a$10$uDg8RXPpoXkYPp82R/Y1VuZxpkfz77qGqTRheBOHT5bjxSEo21K0u',
      salt: '$2a$10$uDg8RXPpoXkYPp82R/Y1Vu',
      events: [],
    },
  ],
];

@WebSocketGateway()
export class CompetitorsGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  public markers = [];
  public marker = [];
  public testing = 0;
  public static Trackers: any[] = [];
  static addTracker(tracker: any) {
    // console.log('tracker', tracker);
    this.Trackers = [...this.Trackers, tracker];
    // console.log('tracker', tracker);
  }
  @WebSocketServer() wss: Server;
  private logger: Logger = new Logger('LocationGateway');
  afterInit(server: Server) {
    this.logger.log('Initialized!');
  }

  handleDisconnect(client: Socket) {
    // console.log(client);
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  handleConnection(client: Socket, ...args: any[]) {
    this.logger.log(`Client connected: ${client.id}`);
    // console.log(this.markers);
    client.emit('marker', this.markers); // emits all locations when client connects
  }

  // @SubscribeMessage() //receives the marker from the client and emits it to all users.
  @SubscribeMessage('getAllMarkers') //receives the marker from the client and emits it to all users.
  handleEvent(client: Socket, data: any): void {
    // console.log(CompetitorsGateway.Trackers);
    this.wss.emit('getAllMarkers', CompetitorsGateway.Trackers);
  }
}
