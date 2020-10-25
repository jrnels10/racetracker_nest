import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/auth/user.entity';
import { CreateEventDto } from './dto/create-event.dto';
import { GetEventFilterDto } from './dto/get-event-filter.dto';
import { Event } from './event.entity';
import { EventRegistration, EventStatus } from './event.enum';
import { EventRepository } from './event.repository';

@Injectable()
export class EventService {
  constructor(
    @InjectRepository(EventRepository)
    private eventRepository: EventRepository,
  ) {}
  getEvents(filterDto: GetEventFilterDto, user: User): Promise<Event[]> {
    return this.eventRepository.getEvents(filterDto, user);
  }

  async getEventById(id: number, user: User): Promise<Event> {
    const found = await this.eventRepository.findOne({
      where: { id, userId: user.id },
    });
    if (!found) {
      throw new NotFoundException(`Event with ID "${id} was not found`);
    }
    return found;
  }

  async createEvent(
    createEventDto: CreateEventDto,
    user: User,
  ): Promise<Event> {
    return this.eventRepository.createEvent(createEventDto, user);
  }

  async updateEvent(
    id: number,
    status: EventStatus,
    registration: EventRegistration,
    user: User,
  ): Promise<Event> {
    console.log(user);
    const event = await this.getEventById(id, user);
    event.registration = registration;
    event.status = status;
    await event.save();
    return event;
  }
  async deleteEvent(id: number, user: User): Promise<void> {
    const result = await this.eventRepository.delete({ id, userId: user.id });
    if (result.affected === 0) {
      throw new NotFoundException(`Task with ID ${id} was not found`);
    }
  }
}
