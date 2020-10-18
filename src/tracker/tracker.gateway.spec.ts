import { Test, TestingModule } from '@nestjs/testing';
import { TrackerGateway } from './tracker.gateway';

describe('TrackerGateway', () => {
  let gateway: TrackerGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TrackerGateway],
    }).compile();

    gateway = module.get<TrackerGateway>(TrackerGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
