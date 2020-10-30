import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { TrackerService } from './tracker.service';

@Controller('tracker')
export class TrackerController {
  constructor(private TrackerService: TrackerService) {}

  @Get()
  getAllTrackingLocations() {
    return this.TrackerService.getAllLocations();
  }
}
