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
  UseGuards,
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
import { AuthGuard } from '@nestjs/passport';
import { User } from 'src/auth/user.entity';
import { GetUser } from 'src/auth/get-user.decorator';

@UseGuards(AuthGuard())
@Controller('event')
export class EventController {
  private logger = new Logger('EVentsController');
  constructor(private eventService: EventService) {}
  // @UseGuards(AuthGuard())
  @Get()
  getEvents(
    @Query(ValidationPipe) filterDto: GetEventFilterDto,
    @GetUser() user: User,
  ): Promise<Event[]> {
    console.log('events');
    // this.logger.verbose(
    //     `User "${user.username}" retrieving all tasks. Filters: ${JSON.stringify(
    //       filterDto,
    //     )}`,
    //   );
    return this.eventService.getEvents(filterDto, user);
  }

  @Get('/:id')
  async getEventById(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: User,
  ): Promise<Event> {
    return await this.eventService.getEventById(id, user);
  }

  @Patch('/:id')
  async updateEventById(
    @Param('id') id: number,
    @Body('status', EventStatusValidationPipe) status: EventStatus,
    @Body('registration', EventRegistrationValidationPipe)
    registration: EventRegistration,
    @GetUser() user: User,
  ): Promise<Event> {
    return await this.eventService.updateEvent(id, status, registration, user);
  }

  @Post()
  @UsePipes(ValidationPipe)
  async createEvent(
    @Body() createEventDto: CreateEventDto,
    @GetUser() user: User,
  ): Promise<Event> {
    console.log(createEventDto);
    return await this.eventService.createEvent(createEventDto, user);
  }

  @Delete('/:id')
  deleteEvent(@Param('id') id: number, @GetUser() user: User): void {
    this.eventService.deleteEvent(id, user);
  }
}
