import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseUUIDPipe,
  HttpCode,
  HttpStatus,
  Res,
} from '@nestjs/common';
import { ContentService } from './content.service';
import { CreateContentDto } from './dto/create-content.dto';
import { UpdateContentDto } from './dto/update-content.dto';
import { QueryContentDto } from './dto/query-content.dto';
import { Response } from 'express';
import sendResponse from '../../utils/sendResponse';
import { ApiOperation } from '@nestjs/swagger';

@Controller('content')
export class ContentController {
  constructor(private readonly contentService: ContentService) {}
  @ApiOperation({ summary: '' })
  @Post()
  async create(@Body() dto: CreateContentDto, @Res() res: Response) {
    const data = await this.contentService.create(dto);
    return sendResponse(res, {
      statusCode: HttpStatus.CREATED,
      success: true,
      message: 'Content created successfully.',
      data,
    });
  }

  @Get()
  async findAll(@Query() query: QueryContentDto, @Res() res: Response) {
    const data = await this.contentService.findAll(query);
    return sendResponse(res, {
      statusCode: HttpStatus.OK,
      success: true,
      message: 'Content retrieve successfully.',
      data,
    });
  }

  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string, @Res() res: Response) {
    const data = await this.contentService.findOne(id);
    return sendResponse(res, {
      statusCode: HttpStatus.OK,
      success: true,
      message: 'Content retrieve successfully.',
      data,
    });
  }

  @Patch(':id')
  async update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateContentDto, @Res() res: Response) {
    const data = await this.contentService.update(id, dto);
    return sendResponse(res, {
      statusCode: HttpStatus.OK,
      success: true,
      message: 'Content updated successfully.',
      data,
    });
  }

  @Delete(':id')
  @HttpCode(204)
  async remove(@Param('id', ParseUUIDPipe) id: string, @Res() res: Response) {
    const data = await this.contentService.remove(id);
    return sendResponse(res, {
      statusCode: HttpStatus.OK,
      success: true,
      message: 'Content deleted successfully.',
      data,
    });
  }

  // optional route to increment views
  @Post(':id/views')
  @HttpCode(200)
  incrementViews(@Param('id', ParseUUIDPipe) id: string) {
    return this.contentService.incrementViews(id);
  }
}
