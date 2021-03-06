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
import { CompetitorsGateway } from './Competitors.gateway';

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
export class TrackerGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  public markers = [];
  public marker = [];
  public testing = 0;

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
    client.emit('marker', this.markers); // emits all locations when client connects
    this.wss.emit('marker', this.markers);
  }

  // @SubscribeMessage() //receives the marker from the client and emits it to all users.
  @SubscribeMessage('marker') //receives the marker from the client and emits it to all users.
  handleEvent(client: Socket, data: any): void {
    const foundUser = this.markers.find(usr => usr.id === data[1].id);
    if (foundUser) {
      const index = this.markers.findIndex(mrkr => mrkr.id === data[1].id);
      this.markers[index].updateLocation({ ...data[0] });
    } else {
      const { firstName, lastName, email, id } = data[1];
      const { latitude, longitude, speed } = data[0];
      const competitor = new EventCompetitor({
        id,
        firstName,
        lastName,
        email,
        latitude,
        longitude,
        speed,
      });
      this.markers = [...this.markers, competitor];
      CompetitorsGateway.addTracker(competitor);
      this.wss.emit('marker', competitor);
    }
  }
}

export class EventCompetitor {
  firstName: string;
  id: any;
  lastName: string;
  email: string;
  position: number;
  lap: number;
  profile: string;
  latitude: number;
  longitude: number;
  speed: number;
  raceNumber: number;
  constructor({
    id = null,
    firstName = '',
    lastName = '',
    email = '',
    position = 0,
    lap = 1,
    profile = 'https://storage.googleapis.com/grandmas-recipes/coco_cuddles.jpg',
    latitude = 0,
    longitude = 0,
    speed = 0,
    raceNumber = 0,
  }) {
    this.id = id;
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.position = position;
    this.lap = lap;
    this.profile = profile;
    this.latitude = latitude;
    this.longitude = longitude;
    this.speed = speed;
    this.raceNumber = raceNumber;
  }

  updateLocation = ({ latitude, longitude, speed }) => {
    this.latitude = latitude;
    this.longitude = longitude;
    this.speed = speed;
    return this;
  };
}
