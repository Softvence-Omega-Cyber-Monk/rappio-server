import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
  HttpStatus,
  Query,
  ParseUUIDPipe,
  HttpCode,
} from '@nestjs/common';
import { WatchHistoryService } from './watch-history.service';
import { CreateWatchHistoryDto } from './dto/create-watch-history.dto';
import { UpdateWatchHistoryDto } from './dto/update-watch-history.dto';
import { ApiOperation } from '@nestjs/swagger';
import sendResponse from '../../utils/sendResponse';
import { Request, Response } from 'express';
import { QueryWatchHistoryDto } from './dto/query-watch-history.dto';

@Controller('watch-history')
export class WatchHistoryController {
  constructor(private readonly service: WatchHistoryService) {}

  @ApiOperation({ summary: 'Create or update watch history for a user & content (upsert)' })
  @Post()
  async create(@Body() dto: CreateWatchHistoryDto, @Res() res: Response) {
    const data = await this.service.create(dto);
    return sendResponse(res, {
      statusCode: HttpStatus.CREATED,
      success: true,
      message: 'Watch history recorded successfully.',
      data,
    });
  }

  @ApiOperation({ summary: 'List watch history (supports filters and pagination)' })
  @Get()
  async findAll(@Query() query: QueryWatchHistoryDto, @Res() res: Response) {
    const data = await this.service.findAll(query);
    return sendResponse(res, {
      statusCode: HttpStatus.OK,
      success: true,
      message: 'Watch history retrieved successfully.',
      data,
    });
  }

  @ApiOperation({ summary: 'Get single watch history record' })
  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string, @Res() res: Response) {
    const data = await this.service.findOne(id);
    return sendResponse(res, {
      statusCode: HttpStatus.OK,
      success: true,
      message: 'Watch history retrieved successfully.',
      data,
    });
  }

  @ApiOperation({ summary: 'Update watch history record' })
  @Patch(':id')
  async update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateWatchHistoryDto, @Res() res: Response) {
    const data = await this.service.update(id, dto);
    return sendResponse(res, {
      statusCode: HttpStatus.OK,
      success: true,
      message: 'Watch history updated successfully.',
      data,
    });
  }

  @ApiOperation({ summary: 'Delete watch history record' })
  @Delete(':id')
  @HttpCode(204)
  async remove(@Param('id', ParseUUIDPipe) id: string, @Res() res: Response) {
    const data = await this.service.remove(id);
    return sendResponse(res, {
      statusCode: HttpStatus.OK,
      success: true,
      message: 'Watch history deleted successfully.',
      data,
    });
  }
}
