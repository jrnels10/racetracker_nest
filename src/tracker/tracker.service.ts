import { Injectable } from '@nestjs/common';

@Injectable()
export class TrackerService {
  private locations = [];

  getAllLocations() {
    return this.locations;
  }
}
