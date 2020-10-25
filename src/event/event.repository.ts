import { EntityRepository, Repository } from 'typeorm';
import { Event } from './event.entity';
import { CreateEventDto } from './dto/create-event.dto';
import { EventRegistration, EventStatus } from './event.enum';
import { GetEventFilterDto } from './dto/get-event-filter.dto';
import { userInfo } from 'os';
import { stat } from 'fs';
import { InternalServerErrorException, Logger } from '@nestjs/common';
import { User } from 'src/auth/user.entity';

@EntityRepository(Event)
export class EventRepository extends Repository<Event> {
  private logger = new Logger('EventRepository');

  async createEvent(
    createEventDto: CreateEventDto,
    user: User,
  ): Promise<Event> {
    const {
      title,
      description,
      location,
      duration,
      length,
      date,
      registration,
      status,
    } = createEventDto;
    const event = new Event();
    event.title = title;
    event.description = description;
    event.location = location;
    event.duration = duration;
    event.length = length;
    event.date = date;
    event.user = user;
    (event.registration = registration
      ? registration
      : EventRegistration.CLOSED),
      (event.status = status ? status : EventStatus.TBD),
      await event.save();

    delete event.user; //removes the user from the event before sending it back to client
    return event;
  }

  async getEvents(filterDto: GetEventFilterDto, user: User): Promise<Event[]> {
    const { search, status, registration } = filterDto;
    const query = this.createQueryBuilder('event');
    if (user) {
      query.where('event.userId = :userId', { userId: user.id });
    }

    if (status) {
      query.andWhere('event.status = :status', { status });
    }
    if (registration) {
      query.andWhere('event.registration = :registration', { registration });
    }
    if (search) {
      query.andWhere(
        '(event.title LIKE :search OR event.description LIKE :search)',
        { search: `%${search}%` },
      );
    }
    try {
      const events = query.getMany();
      return events;
    } catch (error) {
      this.logger.error(
        `Failed to get task for user`, // "${user.username}"`,
        error.stack,
      );
      throw new InternalServerErrorException();
    }
  }
}
