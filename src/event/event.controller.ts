import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
// import { Event, EventRegistration, EventStatus } from './event.model';
import { EventService } from './event.service';
import { CreateEventDto } from './dto/create-event.dto';
import { GetEventFilterDto } from './dto/get-event-filter.dto';
import {
  EventStatusValidationPipe,
  EventRegistrationValidationPipe,
} from './pipes/event-validation.pipe';
import { Event } from './event.entity';
import { EventRegistration, EventStatus } from './event.enum';

@Controller('event')
export class EventController {
  private logger = new Logger('EVentsController');
  constructor(private eventService: EventService) {}

  @Get()
  getEvents(
    @Query(ValidationPipe) filterDto: GetEventFilterDto,
  ): Promise<Event[]> {
    // this.logger.verbose(
    //     `User "${user.username}" retrieving all tasks. Filters: ${JSON.stringify(
    //       filterDto,
    //     )}`,
    //   );
    return this.eventService.getEvents(filterDto);
  }

  @Get('/:id')
  async getEventById(@Param('id', ParseIntPipe) id: number): Promise<Event> {
    return await this.eventService.getEventById(id);
  }

  @Patch('/:id')
  async updateEventById(
    @Param('id') id: number,
    @Body('status', EventStatusValidationPipe) status: EventStatus,
    @Body('registration', EventRegistrationValidationPipe)
    registration: EventRegistration,
  ): Promise<Event> {
    return await this.eventService.updateEvent(id, status, registration);
  }
  @Post()
  @UsePipes(ValidationPipe)
  async createEvent(@Body() createEventDto: CreateEventDto): Promise<Event> {
    return await this.eventService.createEvent(createEventDto);
  }

  @Delete('/:id')
  deleteEvent(@Param('id') id: number): void {
    this.eventService.deleteEvent(id);
  }
}
