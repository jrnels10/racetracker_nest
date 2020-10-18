import { Module } from '@nestjs/common';
// import { TrackerController } from './tracker.controller';
import { TrackerService } from './tracker.service';
// import { TrackerGateway } from './tracker.gateway';
import { TrackerController } from './tracker.controller';

@Module({
  //   controllers: [TrackerController],
  providers: [TrackerService],
  controllers: [TrackerController],
})
export class TrackerModule {}
