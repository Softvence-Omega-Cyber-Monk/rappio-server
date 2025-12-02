import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsOptional } from 'class-validator';

export class CreateUserNotificationPreferenceDto {
  @ApiPropertyOptional({ type: Boolean, default: false })
  @IsBoolean()
  @IsOptional()
  channelLive?: boolean;

  @ApiPropertyOptional({ type: Boolean, default: false })
  @IsBoolean()
  @IsOptional()
  newVideoUpload?: boolean;

  @ApiPropertyOptional({ type: Boolean, default: false })
  @IsBoolean()
  @IsOptional()
  platformAnnounce?: boolean;
}
