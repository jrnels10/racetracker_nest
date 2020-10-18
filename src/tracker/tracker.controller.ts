import { Controller, Get } from '@nestjs/common';
import { TrackerService } from './tracker.service';

@Controller('tracker')
export class TrackerController {
  constructor(private TrackerService: TrackerService) {}

  @Get()
  getAllTrackingLocations() {
    return this.TrackerService.getAllLocations();
  }
}
