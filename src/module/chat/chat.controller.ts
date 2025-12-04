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
} from '@nestjs/common';
import { ChatService } from './chat.service';
import { CreateChatDto } from './dto/create-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { SendMessageDto } from './dto/send-message.dto';
import { CreateParticipantDto } from './dto/create-participant.dto';
import { Response } from 'express';
import sendResponse from '../../utils/sendResponse';

@ApiTags('chat')
@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post()
  @ApiOperation({ summary: 'Create a chat room' })
  async create(@Body() dto: CreateChatDto,@Res() res: Response) {
    const data = await this.chatService.create(dto);
    return sendResponse(res, {
      statusCode: HttpStatus.CREATED,
      success: true,
      message: 'Chat created successfully.',
      data,
    });
  }

  @Get()
  @ApiOperation({ summary: 'Get all chat rooms' })
  async findAll(@Res() res: Response) {
    const data = await this.chatService.findAll();
    return sendResponse(res, {
      statusCode: HttpStatus.OK,
      success: true,
      message: 'Chat retrieve successfully.',
      data,
    });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a chat room by ID' })
  async findOne(@Param('id') id: string,@Res() res: Response) {
    const data = await this.chatService.findOne(id);
    return sendResponse(res, {
      statusCode: HttpStatus.OK,
      success: true,
      message: 'Chat retrieve successfully.',
      data,
    });
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a chat room' })
  async update(@Param('id') id: string, @Body() dto: UpdateChatDto,@Res() res: Response) {
    const data = await this.chatService.update(id, dto);
    return sendResponse(res, {
      statusCode: HttpStatus.OK,
      success: true,
      message: 'Chat updated successfully.',
      data,
    });
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a chat room' })
  async remove(@Param('id') id: string,@Res() res: Response) {
    const data = await this.chatService.remove(id);
    return sendResponse(res, {
      statusCode: HttpStatus.OK,
      success: true,
      message: 'Chat deleted successfully.',
      data,
    });
  }

  @Post(':id/participants')
  @ApiOperation({ summary: 'Add a participant to chat room' })
  async addParticipant(@Param('id') roomId: string, @Body() dto: CreateParticipantDto,@Res() res: Response) {
    const data = await this.chatService.addParticipant(roomId, dto.userId);
    return sendResponse(res, {
      statusCode: HttpStatus.CREATED,
      success: true,
      message: 'Chat Participant Added successfully.',
      data,
    });
  }

  @Delete('participants/:participantId')
  @ApiOperation({ summary: 'Remove a participant from chat room' })
  async removeParticipant(@Param('participantId') participantId: string, @Res() res: Response) {
    const data = await this.chatService.removeParticipant(participantId);
    return sendResponse(res, {
      statusCode: HttpStatus.OK,
      success: true,
      message: 'Chat Participant deleted successfully.',
      data,
    });
  }

  @Post(':id/messages')
  @ApiOperation({ summary: 'Send a message in a chat room' })
  async sendMessage(@Param('id') roomId: string, @Body() dto: SendMessageDto,@Res() res: Response) {
    const data = await this.chatService.sendMessage(roomId, dto.userId, dto.content);
    return sendResponse(res, {
      statusCode: HttpStatus.CREATED,
      success: true,
      message: 'Chat message created successfully.',
      data,
    });
  }

  @Get(':id/messages')
  @ApiOperation({ summary: 'Get all messages of a chat room' })
  async getMessages(@Param('id') roomId: string,@Res() res: Response) {
    const data = await this.chatService.getMessages(roomId);
    return sendResponse(res, {
      statusCode: HttpStatus.OK,
      success: true,
      message: 'Messages retrieve successfully.',
      data,
    });
  }
}
