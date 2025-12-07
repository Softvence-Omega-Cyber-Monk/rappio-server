import { Test, TestingModule } from '@nestjs/testing';
import { R2WorkerController } from './r2-worker.controller';
import { R2WorkerService } from './r2-worker.service';

describe('R2WorkerController', () => {
  let controller: R2WorkerController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [R2WorkerController],
      providers: [R2WorkerService],
    }).compile();

    controller = module.get<R2WorkerController>(R2WorkerController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
