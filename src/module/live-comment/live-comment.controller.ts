import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UseGuards,
} from '@nestjs/common';
import { LiveCommentService } from './live-comment.service';
import { CreateLiveCommentDto } from './dto/create-live-comment.dto';
import { UpdateLiveCommentDto } from './dto/update-live-comment.dto';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetMe } from '../user/dto/request-with-user.interface';


@ApiTags('live-comments')
@Controller('live-comments')
export class LiveCommentController {
  //constructor(private readonly liveCommentService: LiveCommentService) {}
  constructor(private readonly service: LiveCommentService) {}

  // GET /live-comments/:videoId
  @Get(':videoId')
  getAll(@Param('videoId') videoId: string) {
    return this.service.getAll(videoId);
  }


  @UseGuards(JwtAuthGuard)
  @Post()
  create(
    @Body() body: CreateLiveCommentDto,
    @Req() req: GetMe,
  ) {
    const userId = req.user.id;
    return this.service.create(userId, body);
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
