import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Req,
  Res,
  UseGuards,
  HttpStatus,
  Post,
  Delete,
} from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { UserRole } from '@prisma/client';
import { RequestWithUser } from './dto/request-with-user.interface';
import { UpdateUserDto } from './dto/update-user.dto';
import { Request, Response } from 'express';
import sendResponse from '../../utils/sendResponse';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

import { UpdateMyProfileDto } from './dto/update-myprofile-dto';
import { Roles } from '../auth/guards/roles.decorator';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  // @ApiOperation({ summary: 'Register as a user' })
  // @Post()
  // create(@Body() dto: CreateUserDto) {
  //   return this.userService.create(dto);
  // }
  @ApiOperation({ summary: 'Get all Users' })
  @Get()
  async findAll(@Req() req: RequestWithUser,@Res() res: Response) {
    const data= await this.userService.findAll();
    return sendResponse(res, {
      statusCode: HttpStatus.CREATED,
      success: true,
      message: 'Users retrieve successfully.',
      data,
    });
  }


  @Get(':id')
  @ApiOperation({ summary: 'Retrieve User by ID' })
  @ApiResponse({ status: 200, description: 'The requested User.' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  async findOne(@Param('id') id: string, @Req() req: Request, @Res() res: Response) {
    const data = await this.userService.findOne(id);
    return sendResponse(res, {
      statusCode: HttpStatus.OK,
      success: true,
      message: 'User Retrieve successfully.',
      data,
    });
  }
  @ApiOperation({ summary: 'Allows only ADMIN to update a user’s role or status' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Patch('admin/:id')
  async update(@Param('id') id: string, @Body() dto: UpdateUserDto, @Res() res: Response) {
    const data = await this.userService.update(id, dto);
    return sendResponse(res, {
      statusCode: HttpStatus.CREATED,
      success: true,
      message: 'User updated successfully.',
      data,
    });
  }

  @ApiOperation({ summary: 'update my profile' })
  @Patch(':id')
  async myProfile(@Param('id') id: string,@Body() dto: UpdateMyProfileDto,@Req() req: RequestWithUser, @Res() res: Response) {
    const data = await this.userService.myProfile(id, dto);
    return sendResponse(res, {
      statusCode: HttpStatus.CREATED,
      success: true,
      message: 'Profile updated successfully.',
      data,
    });
  }


  @Delete(':id')
  async remove(@Param('id') id: string, @Res() res: Response) {
    const data = await this.userService.remove(id);
    return sendResponse(res, {
      statusCode: HttpStatus.OK,
      success: true,
      message: 'User deleted successfully.',
      data,
    })
  }
}
