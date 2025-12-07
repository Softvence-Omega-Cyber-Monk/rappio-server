import { Test, TestingModule } from '@nestjs/testing';
import { R2WorkerService } from './r2-worker.service';

describe('R2WorkerService', () => {
  let service: R2WorkerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [R2WorkerService],
    }).compile();

    service = module.get<R2WorkerService>(R2WorkerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
