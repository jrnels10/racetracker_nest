import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TrackerModule } from './tracker/tracker.module';
import { TrackerGateway } from './tracker/tracker.gateway';

@Module({
  imports: [TrackerModule],
  controllers: [AppController],
  providers: [AppService, TrackerGateway],
})
export class AppModule {}
