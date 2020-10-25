import {
  PipeTransform,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';
import { EventRegistration, EventStatus } from '../event.enum';
// import { EventRegistration, EventStatus } from '../event.model';

export class EventStatusValidationPipe implements PipeTransform {
  readonly allowedStatuses = [
    EventStatus.ACTIVE,
    EventStatus.CANCELLED,
    EventStatus.DONE,
    EventStatus.POSTPONED,
    EventStatus.TBD,
  ];

  transform(value: any) {
    value = value.toUpperCase();
    if (!this.isStatusValid(value)) {
      throw new BadRequestException(`${value} is an invalid status!`);
    }
    return value;
  }

  private isStatusValid(status: any) {
    const idx = this.allowedStatuses.indexOf(status);
    return idx !== -1;
  }
}

export class EventRegistrationValidationPipe implements PipeTransform {
  readonly allowedRegistration = [
    EventRegistration.OPEN,
    EventRegistration.CLOSED,
  ];

  transform(value: any) {
    value = value.toUpperCase();
    if (!this.isRegistrationValid(value)) {
      throw new BadRequestException(`${value} is an invalid status!`);
    }
    return value;
  }

  private isRegistrationValid(status: any) {
    const idx = this.allowedRegistration.indexOf(status);
    return idx !== -1;
  }
}
