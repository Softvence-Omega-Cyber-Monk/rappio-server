import { Injectable, Logger } from '@nestjs/common';
import * as fs from 'fs';
import { exec } from 'child_process';
import { promisify } from 'util';

// Promisify the exec function to use async/await
const execPromise = promisify(exec);

@Injectable()
export class VideoService {
  private readonly logger = new Logger(VideoService.name);
  private readonly UPLOADS_DIR = './uploads';

  async transcodeVideoToHLS(videoPath: string, lessonId: string): Promise<void> {
    const outputPath = `${this.UPLOADS_DIR}/courses/${lessonId}`;
    const hlsPath = `${outputPath}/index.m3u8`;

    // 1. Create the output directory recursively
    if (!fs.existsSync(outputPath)) {
      fs.mkdirSync(outputPath, { recursive: true });
    }

    // 2. The FFmpeg Command
    // HLS (HTTP Live Streaming) is the standard format for adaptive video streaming.
    //
    const ffmpegCommand = `ffmpeg -i ${videoPath} \
      -codec:v libx264 -codec:a aac -hls_time 10 -hls_playlist_type vod \
      -hls_segment_filename "${outputPath}/segment%03d.ts" \
      -start_number 0 ${hlsPath}`;

    this.logger.log(`Starting FFmpeg command for lesson ${lessonId}...`);

    try {
      // Execute the command using the promisified exec
      const { stdout, stderr } = await execPromise(ffmpegCommand);

      this.logger.log(`FFmpeg stdout: ${stdout}`);
      if (stderr) {
        this.logger.warn(`FFmpeg stderr (may contain warnings): ${stderr}`);
      }
      this.logger.log(`Transcoding completed successfully for lesson ${lessonId}`);

    } catch (error) {
      this.logger.error(`FFmpeg failed for lesson ${lessonId}: ${error.message}`);
      // In a real application, you should handle cleanup and rollback here.
      throw new Error('FFmpeg Transcoding Error');
    }
  }
}
