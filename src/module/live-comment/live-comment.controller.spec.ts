import { Test, TestingModule } from '@nestjs/testing';
import { LiveCommentController } from './live-comment.controller';
import { LiveCommentService } from './live-comment.service';

describe('LiveCommentController', () => {
  let controller: LiveCommentController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LiveCommentController],
      providers: [LiveCommentService],
    }).compile();

    controller = module.get<LiveCommentController>(LiveCommentController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
