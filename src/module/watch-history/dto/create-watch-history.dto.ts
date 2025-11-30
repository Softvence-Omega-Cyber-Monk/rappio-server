import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsInt, Min } from 'class-validator';

export class CreateWatchHistoryDto {
  @ApiProperty({ example: 'user-uuid' })
  @IsUUID()
  userId: string;

  @ApiProperty({ example: 'content-uuid' })
  @IsUUID()
  contentId: string;

  @ApiProperty({ example: 120 })
  @IsInt()
  @Min(0)
  progressSeconds: number;
}
