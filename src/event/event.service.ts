import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
// import { Event, EventStatus, EventRegistration } from './event.model';
import { v1 as uuidv1 } from 'uuid';
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
  getEvents(filterDto: GetEventFilterDto): Promise<Event[]> {
    return this.eventRepository.getEvents(filterDto);
  }

  async getEventById(id: number): Promise<Event> {
    const found = await this.eventRepository.findOne(id);
    if (!found) {
      throw new NotFoundException(`Event with ID "${id} was not found`);
    }
    return found;
  }

  async createEvent(createEventDto: CreateEventDto): Promise<Event> {
    return this.eventRepository.createEvent(createEventDto);
  }

  async updateEvent(
    id: number,
    status: EventStatus,
    registration: EventRegistration,
  ): Promise<Event> {
    const event = await this.getEventById(id); //, user);
    event.registration = registration;
    event.status = status;
    await event.save();
    return event;
  }
  async deleteEvent(id: number): Promise<void> {
    const result = await this.eventRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Task with ID ${id} was not found`);
    }
  }
}
