import { Test, TestingModule } from '@nestjs/testing';
import { LiveCommentService } from './live-comment.service';

describe('LiveCommentService', () => {
  let service: LiveCommentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LiveCommentService],
    }).compile();

    service = module.get<LiveCommentService>(LiveCommentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
