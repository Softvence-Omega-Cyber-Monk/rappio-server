import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  Res,
  Logger,
  HttpStatus,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { Response } from 'express';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { VideoService } from './video.service';

const storage = diskStorage({
  destination: 'uploads',
  filename: (_, file, cb) => {
    cb(
      null,
      `video-${uuidv4()}${path.extname(file.originalname)}`,
    );
  },
});

@Controller('video')
export class VideoController {
  private readonly logger = new Logger(VideoController.name);

  constructor(private readonly videoService: VideoService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file', { storage }))
  async uploadVideo(
    @UploadedFile() file: Express.Multer.File,
    @Res() res: Response,
  ) {
    if (!file) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ message: 'No file uploaded' });
    }

    const lessonId = uuidv4();

    try {
      await this.videoService.transcodeVideoToHLS(
        file.path,
        lessonId,
      );

      return res.status(HttpStatus.OK).json({
        message: 'Video converted to HLS',
        lessonId,
        playlistUrl: `http://localhost:5000/uploads/courses/${lessonId}/index.m3u8`,
      });
    } catch (err) {
      this.logger.error(err);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Transcoding failed',
        error: err.message,
      });
    }
  }
}
