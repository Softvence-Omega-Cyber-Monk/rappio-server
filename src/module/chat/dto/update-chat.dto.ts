import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { CreateChatDto } from './create-chat.dto';

export class UpdateChatDto extends PartialType(CreateChatDto) {
  @ApiPropertyOptional({ description: 'Whether the chat is active' })
  isActive?: boolean;
}
