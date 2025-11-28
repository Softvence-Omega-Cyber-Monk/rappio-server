import { IsOptional, IsString, MaxLength } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateChannelDto {
  @ApiPropertyOptional({ example: 'Tech Guru', description: 'Display name of the channel' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  name?: string;

  @ApiPropertyOptional({ example: 'I stream software, tutorials', description: 'Channel description' })
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  description?: string;

  @ApiPropertyOptional({ example: 'techguru', description: 'Public handle (no @). Changing is limited once every 30 days' })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  handle?: string;
}
