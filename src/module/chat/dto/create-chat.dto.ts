import { ApiProperty } from '@nestjs/swagger';

export class CreateChatDto {
  @ApiProperty({ description: 'Channel ID that owns this chat room' })
  channelId: string;

  @ApiProperty({ description: 'Whether the chat is active', required: false })
  isActive?: boolean;
}
