// import {
//   Body,
//   Controller,
//   Post,
//   UseInterceptors,
//   UploadedFile,
//   BadRequestException,
// } from '@nestjs/common';
// import { FileInterceptor } from '@nestjs/platform-express';
// import { R2WorkerService } from './r2-worker.service';
// import { InitiateR2Dto } from './dto/initiate-r2.dto';
// import { CompleteR2Dto } from './dto/complete-r2.dto';
//
// @Controller('uploads/r2')
// export class R2WorkerController {
//   constructor(private readonly svc: R2WorkerService) {}
//
//   // POST /uploads/r2/initiate
//   @Post('initiate')
//   async initiate(@Body() body: InitiateR2Dto) {
//     if (!body?.key) throw new BadRequestException('key is required');
//     return this.svc.initiate(body.key);
//   }
//
//   // POST /uploads/r2/part
//   // Accept form-data with fields: uploadId, partNumber, chunk (file)
//   // @UseInterceptors(FileInterceptor('chunk'))
//   // @Post('part')
//   // async part(@Body() body: any, @UploadedFile() file: Express.Multer.File) {
//   //   const uploadId = body?.uploadId;
//   //   const partNumber = Number(body?.partNumber || 0);
//   //
//   //   if (!uploadId) throw new BadRequestException('uploadId is required');
//   //   if (!partNumber || Number.isNaN(partNumber) || partNumber < 1) throw new BadRequestException('partNumber is required and must be >= 1');
//   //   if (!file || !file.buffer) throw new BadRequestException('chunk file is required');
//   //
//   //   // forward buffer to worker
//   //   const res = await this.svc.uploadPart(uploadId, partNumber, file.buffer);
//   //   return res; // { etag }
//   // }
//   @UseInterceptors(FileInterceptor('chunk'))
//   @Post('part')
//   async part(
//     @Body() body: { uploadId?: string; partNumber?: string },
//     @UploadedFile() file: Express.Multer.File,
//   ) {
//     const uploadId = body?.uploadId;
//     const partNumber = Number(body?.partNumber || 0);
//
//     if (!uploadId) throw new BadRequestException('uploadId is required');
//     if (!partNumber || Number.isNaN(partNumber) || partNumber < 1)
//       throw new BadRequestException('partNumber is required and must be >= 1');
//     if (!file || !file.buffer) throw new BadRequestException('chunk file is required');
//
//     // forward buffer to worker
//     const res = await this.svc.uploadPart(uploadId, partNumber, file.buffer);
//     return res; // { etag }
//   }
//   // POST /uploads/r2/complete
//   @Post('complete')
//   async complete(@Body() body: CompleteR2Dto) {
//     const { uploadId, key, parts } = body;
//     if (!uploadId || !key || !Array.isArray(parts)) {
//       throw new BadRequestException('uploadId, key and parts are required');
//     }
//     return this.svc.complete(uploadId, key, parts);
//   }
// }
// src/r2/r2.controller.ts
import { Controller, Post, Body, BadRequestException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { R2Service } from './r2-worker.service';
import { InitiateR2Dto } from './dto/initiate-r2.dto';
import { CompleteR2Dto } from './dto/complete-r2.dto';
import { AbortR2Dto } from './dto/abort-r2.dto';

@Controller('r2')
export class R2Controller {
  constructor(private readonly r2: R2Service) {}

  // Initiate: client asks server to create multipart and request presigned URLs
  @Post('initiate')
  async initiate(@Body() body: InitiateR2Dto) {

    const filename = body.filename || `uploads/${Date.now()}-${uuidv4()}`;
    const partSize = Number(body.partSize) || 8 * 1024 * 1024; // default 8MiB

    if (partSize < 5 * 1024 * 1024) {
      throw new BadRequestException('partSize must be >= 5 MiB');
    }

    // estimate number of parts from an optional client-supplied fileSize
    // but we will accept that client might not know; client may request many urls or call presign per range.
    const partsCount = Number(body['partsCount'] || body['estimatedParts'] || 0);

    if (partsCount && partsCount > 10000) {
      throw new BadRequestException('too many parts');
    }

    // If client didn't provide partsCount, we can return an uploadId and let client request presigned URLs per part as needed.
    // For simplicity, require partsCount from client (calculated client-side).
    if (!partsCount || partsCount < 1) {
      throw new BadRequestException('partsCount is required (client calculates based on fileSize / partSize)');
    }

    const res = await this.r2.createMultipartPresigned(filename, partSize, partsCount);
    return res; // { uploadId, key, urls: [...] }
  }

  // Complete: client must send parts array like [{PartNumber, ETag},...]
  @Post('complete')
  async complete(@Body() body: CompleteR2Dto) {
    const { uploadId, key, parts } = body;
    if (!uploadId || !key || !Array.isArray(parts)) throw new BadRequestException('uploadId, key and parts are required');
    return this.r2.completeMultipart(uploadId, key, parts);
  }

  @Post('abort')
  async abort(@Body() body: AbortR2Dto) {
    const { uploadId, key } = body;
    if (!uploadId || !key) throw new BadRequestException('uploadId and key required');
    return this.r2.abortMultipart(uploadId, key);
  }
}
