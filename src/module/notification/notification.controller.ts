import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
  HttpStatus
} from '@nestjs/common';
import { NotificationService } from './notification.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';
import sendResponse from '../../utils/sendResponse';

@ApiTags('Notifications')
@Controller('notification')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new notification' })
  async create(@Body() dto: CreateNotificationDto, @Res() res: Response) {
    const data = await this.notificationService.create(dto);
    return sendResponse(res, {
      statusCode: HttpStatus.CREATED,
      success: true,
      message: 'Notification created successfully.',
      data,
    });
  }

  @Get()
  @ApiOperation({ summary: 'Retrieve all notifications (optionally filtered by userId)' })
  async findAll(@Res() res: Response, @Param('userId') userId?: string) {
    const data = await this.notificationService.findAll(userId);
    return sendResponse(res, {
      statusCode: HttpStatus.OK,
      success: true,
      message: 'Notifications retrieved successfully.',
      data,
    });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retrieve a notification by ID' })
  async findOne(@Param('id') id: string, @Res() res: Response) {
    const data = await this.notificationService.findOne(id);
    return sendResponse(res, {
      statusCode: HttpStatus.OK,
      success: true,
      message: `Notification with ID ${id} retrieved successfully.`,
      data,
    });
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a notification by ID' })
  async update(@Param('id') id: string, @Body() dto: UpdateNotificationDto, @Res() res: Response) {
    const data = await this.notificationService.update(id, dto);
    return sendResponse(res, {
      statusCode: HttpStatus.OK,
      success: true,
      message: `Notification with ID ${id} updated successfully.`,
      data,
    });
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a notification by ID' })
  async remove(@Param('id') id: string, @Res() res: Response) {
    const data = await this.notificationService.remove(id);
    return sendResponse(res, {
      statusCode: HttpStatus.OK,
      success: true,
      message: `Notification with ID ${id} deleted successfully.`,
      data,
    });
  }
}
