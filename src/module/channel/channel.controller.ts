import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Res,
} from '@nestjs/common';
import { ChannelService } from './channel.service';
import { Response } from 'express';
import sendResponse from '../../utils/sendResponse';


@Controller('channels')
export class ChannelController {
  constructor(private readonly channelService: ChannelService) {}

  /**GET /channels/:handle - Public view of a channel profile and content list.*/
  @Get(':handle')
  async getChannel(@Param('handle') handle: string,@Res() res: Response) {
    const data = await this.channelService.getPublicChannel(handle);
    return sendResponse(res, {
      statusCode: HttpStatus.OK,
      success: true,
      message: 'view of a channel profile and content list successfully.',
      data,
    });
  }
  /**
   * GET /channels/validate-stream/:key - Internal/RTMP Server route for stream key validation.
   * NOTE: This should be heavily secured, ideally not exposed publicly, but placed here for demonstration.
   */
  @Get('validate-stream/:key')
  @HttpCode(200)
  async validateStreamKey(@Param('key') key: string,@Res() res: Response,) {
    const isValid = await this.channelService.validateStreamKey(key);
    // Return a simple boolean status for the RTMP server || return { valid: isValid };
    return sendResponse(res, {
      statusCode: HttpStatus.OK,
      success: true,
      message: 'view of a channel profile and content list successfully.',
      data: { valid: isValid },
    });
  }

  
}