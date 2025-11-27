import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
} from '@nestjs/common';
import { MailService } from './mail.service';
import { CreateMailDto } from './dto/create-mail.dto';
import { UpdateMailDto } from './dto/update-mail.dto';

@Controller('mail')
export class MailController {
  constructor(private readonly mailService: MailService) {}



  @Get()
  sendMail(@Req() req, ) {
    return this.mailService.sendMail(
      "test@gmail.com",
      "SMTP Test",
      "<h1>Hello SMTP Works!</h1>"
    );
  }

}
