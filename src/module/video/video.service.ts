import { Injectable, Logger } from '@nestjs/common';
import { spawn } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class VideoService {
  private readonly logger = new Logger(VideoService.name);

  // Use FFmpeg from PATH (Windows/Linux safe)
  private readonly FFMPEG_PATH = 'ffmpeg';

  async transcodeVideoToHLS(
    videoPath: string,
    lessonId: string,
  ): Promise<void> {
    const uploadsDir = path.join(process.cwd(), 'uploads');
    const outputDir = path.join(uploadsDir, 'courses', lessonId);

    const playlistPath = path.join(outputDir, 'index.m3u8');
    const segmentPattern = path.join(outputDir, 'segment_%03d.ts');

    fs.mkdirSync(outputDir, { recursive: true });

    const inputPath = path.resolve(videoPath);

    this.logger.log(`🎬 FFmpeg started`);
    this.logger.log(`Input: ${inputPath}`);
    this.logger.log(`Output: ${playlistPath}`);

    return new Promise((resolve, reject) => {
      const ffmpeg = spawn(
        this.FFMPEG_PATH,
        [
          '-y',
          '-i',
          inputPath,

          '-map',
          '0:v:0',
          '-map',
          '0:a:0?',

          '-c:v',
          'libx264',
          '-preset',
          'veryfast',
          '-crf',
          '23',

          '-c:a',
          'aac',
          '-b:a',
          '128k',

          '-hls_time',
          '6',
          '-hls_playlist_type',
          'vod',
          '-hls_segment_filename',
          segmentPattern,

          playlistPath,
        ],
        {
          windowsHide: true,
        },
      );

      ffmpeg.stderr.on('data', (data) => {
        this.logger.log(`FFmpeg: ${data.toString()}`);
      });

      ffmpeg.on('error', (err) => {
        this.logger.error('FFmpeg failed to start', err);
        reject(err);
      });

      ffmpeg.on('close', (code) => {
        if (code === 0 && fs.existsSync(playlistPath)) {
          this.logger.log('✅ HLS transcoding completed');
          resolve();
        } else {
          reject(new Error(`FFmpeg exited with code ${code}`));
        }
      });
    });
  }
}



// import { Injectable, Logger } from '@nestjs/common';
// import * as fs from 'fs';
// import * as path from 'path';
// import { spawn } from 'child_process';
//
// @Injectable()
// export class VideoService {
//   private readonly logger = new Logger(VideoService.name);
//   private readonly UPLOADS_DIR = './uploads';
//   // Your FFmpeg path
//   private readonly FFMPEG_PATH = 'C:\\Users\\tareq_o8d5ree\\Downloads\\ffmpeg-2025-12-10-git-4f947880bd-full_build\\bin\\ffmpeg.exe';
//
//   async transcodeVideoToHLS(videoPath: string, lessonId: string): Promise<void> {
//     const outputPath = path.resolve(`${this.UPLOADS_DIR}/courses/${lessonId}`);
//
//     // Create output directory
//     if (!fs.existsSync(outputPath)) {
//       fs.mkdirSync(outputPath, { recursive: true });
//       this.logger.log(`Created directory: ${outputPath}`);
//     }
//
//     const absoluteVideoPath = path.resolve(videoPath);
//     const outputFile = path.join(outputPath, 'index.m3u8');
//     const segmentPattern = path.join(outputPath, 'segment%03d.ts');
//
//     this.logger.log(`Starting FFmpeg for lesson ${lessonId}`);
//     this.logger.log(`Input: ${absoluteVideoPath}`);
//     this.logger.log(`Output: ${outputFile}`);
//
//     return new Promise((resolve, reject) => {
//       const ffmpeg = spawn(
//         this.FFMPEG_PATH,  // Use the full path
//         [
//           '-y',                           // Overwrite output files
//           '-i', absoluteVideoPath,        // Input file
//           '-c:v', 'libx264',             // Video codec
//           '-c:a', 'aac',                 // Audio codec
//           '-hls_time', '10',             // Segment duration
//           '-hls_playlist_type', 'vod',   // Playlist type
//           '-hls_segment_filename', segmentPattern, // Segment naming
//           '-start_number', '0',          // Start segment numbering at 0
//           outputFile                      // Output playlist
//         ],
//         { shell: true }
//       );
//
//       let stderrData = '';
//
//       // Capture ALL output (FFmpeg writes to stderr by default)
//       ffmpeg.stderr.on('data', (data) => {
//         const output = data.toString();
//         stderrData += output;
//         this.logger.log(`FFmpeg: ${output}`);
//       });
//
//       ffmpeg.stdout.on('data', (data) => {
//         this.logger.log(`FFmpeg stdout: ${data.toString()}`);
//       });
//
//       ffmpeg.on('error', (error) => {
//         this.logger.error(`FFmpeg spawn error: ${error.message}`);
//         reject(new Error(`FFmpeg spawn failed: ${error.message}`));
//       });
//
//       ffmpeg.on('close', (code) => {
//         if (code === 0) {
//           this.logger.log(`✅ Transcoding completed for lesson ${lessonId}`);
//
//           // Verify output files exist
//           if (fs.existsSync(outputFile)) {
//             this.logger.log(`✅ HLS playlist created: ${outputFile}`);
//             resolve();
//           } else {
//             this.logger.error(`HLS file not created: ${outputFile}`);
//             reject(new Error('HLS file not created'));
//           }
//         } else {
//           this.logger.error(`❌ FFmpeg exited with code ${code}`);
//           this.logger.error(`Full FFmpeg output:\n${stderrData}`);
//           reject(new Error(`FFmpeg failed with exit code ${code}`));
//         }
//       });
//     });
//   }
// }