import { Injectable } from '@nestjs/common';

@Injectable()
export class TrackerService {
  static addLocation(xyz: any) {
    console.log('xyz', xyz);
  }
  private locations = [];
  addLocation(xyz: string) {
    console.log(xyz);
  }
  getAllLocations() {
    return this.locations;
  }
}
