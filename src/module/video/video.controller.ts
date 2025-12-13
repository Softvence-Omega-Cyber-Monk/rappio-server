import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  HttpStatus,
  Res,
  Logger,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';
import * as path from 'path';
import { VideoService } from './video.service';
// Define the storage configuration for multer
const storage = diskStorage({
  destination: (req, file, cb) => {
    // Ensure the uploads directory exists
    cb(null, './uploads');
  },
  filename: (req, file, cb) => {
    // Generate a unique filename
    cb(null, `${file.fieldname}-${uuidv4()}${path.extname(file.originalname)}`);
  },
});




@Controller('video')
export class VideoController {
  private readonly logger = new Logger(VideoController.name);
  // Inject the VideoService to handle the business logic (ffmpeg)
  constructor(private readonly videoService: VideoService) {}
//  constructor(private readonly videoService: VideoService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file', { storage }))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Res() res: Response,
  ) {
    if (!file) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: 'No file uploaded.',
      });
    }

    const lessonId = uuidv4();
    const videoPath = file.path;
    this.logger.log(`Processing file: ${videoPath} for lesson: ${lessonId}`);

    try {
      // Delegate the transcoding process to the service
      await this.videoService.transcodeVideoToHLS(videoPath, lessonId);

      // Construct the URL for the client to play
      // NOTE: You must use the actual port your NestJS app is running on (e.g., 3000)
      const port = process.env.PORT || 3000;
      const videoUrl = `http://localhost:${port}/uploads/courses/${lessonId}/index.m3u8`;

      return res.status(HttpStatus.OK).json({
        message: 'Video converted to HLS format',
        videoUrl: videoUrl,
        lessonId: lessonId,
      });
    } catch (error) {
      this.logger.error('Transcoding failed', error.stack);
      // Clean up the uploaded file here if needed
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Video transcoding failed',
        error: error.message,
      });
    }
  }
}
