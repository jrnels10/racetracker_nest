// import { EventStatus, EventRegistration } from '../event.model';

import { EventRegistration, EventStatus } from '../event.enum';

export class GetEventFilterDto {
  search: string;
  status: EventStatus;
  registration: EventRegistration;
}
