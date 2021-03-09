// import { EventRegistration, EventStatus } from '../event.model';

import { EventRegistration, EventStatus } from '../event.enum';

export class CreateEventDto {
  title: string;
  description: string;
  location: string;
  duration: number;
  length: number;
  route: number;
  registration: EventRegistration;
  date: Date;
  status: EventStatus;
}
