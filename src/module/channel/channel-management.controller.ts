import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ChannelService } from './channel.service';
import { Response } from 'express';
import sendResponse from '../../utils/sendResponse';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/guards/roles.decorator';
import { UserRole } from '@prisma/client';
import { UpdateChannelDto } from './dto/update-channel.dto';
import { GetMe } from '../user/dto/request-with-user.interface';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Only for CREATOR user Creator Channel Management')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles(UserRole.CREATOR)
@Controller('creator/channel')
export class ChannelManagementController {
  constructor(private readonly channelService: ChannelService) {}

  /*** GET /creator/channel - Retrieves the private channel details, including streamKey.*/
  @Get()
  async getPrivateChannel(@Req() req: GetMe,@Res() res: Response) {
    const userId = req.user.id;
    const data = await this.channelService.getPrivateChannel(userId);
    return sendResponse(res, {
      statusCode: HttpStatus.OK,
      success: true,
      message: 'Retrieves the private channel details successfully.',
      data,
    });
  }


  /**PATCH /creator/channel - Updates channel metadata (name, description, handle).*/
  @Patch()
  async updateChannel(@Req() req: GetMe, @Body() body: UpdateChannelDto,@Res() res: Response) {
    const userId = req.user.id;
    const data = await this.channelService.updateChannel(userId, body);
    return sendResponse(res, {
      statusCode: HttpStatus.OK,
      success: true,
      message: 'Updates channel metadata successfully.',
      data,
    });
  }

  /**POST /creator/channel/key/rotate - Generates a new stream key.*/
  @Post('key/rotate')
  @HttpCode(200)
  async rotateStreamKey(@Req() req: GetMe,@Res() res: Response) {
    const userId = req.user.id;
    const data = await this.channelService.rotateStreamKey(userId);
    return sendResponse(res, {
      statusCode: HttpStatus.OK,
      success: true,
      message: 'Generates a new stream key successfully.',
      data,
    });
  }

}