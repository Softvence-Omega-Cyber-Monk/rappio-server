import { ApiProperty } from '@nestjs/swagger';

export class CreateParticipantDto {
  @ApiProperty({ description: 'User ID of participant' })
  userId: string;
}
