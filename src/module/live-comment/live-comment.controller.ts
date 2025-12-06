import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { LiveCommentService } from './live-comment.service';
import { CreateLiveCommentDto } from './dto/create-live-comment.dto';
import { UpdateLiveCommentDto } from './dto/update-live-comment.dto';

@Controller('live-comment')
export class LiveCommentController {
  //constructor(private readonly liveCommentService: LiveCommentService) {}
  constructor(private readonly service: LiveCommentService) {}

  // GET /live-comments/:videoId
  @Get(':videoId')
  getAll(@Param('videoId') videoId: string) {
    return this.service.getAll(videoId);
  }

  // POST /live-comments
  @Post()
  create(
    @Body()
    body: { userId: string; videoId: string; message: string },
  ) {
    return this.service.create(body.userId, {
      videoId: body.videoId,
      message: body.message,
    });
  }

  // PATCH /live-comments/:id
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateLiveCommentDto) {
    return this.service.update(id, dto);
  }

  // DELETE /live-comments/:id
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
