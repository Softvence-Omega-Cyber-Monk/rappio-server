import { IsString, IsOptional, IsEnum, IsBoolean, IsInt, Min, IsUrl } from 'class-validator';
import { ContentType, ContentStatus } from '@prisma/client';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateContentDto {
  @ApiProperty({ example: 'Introduction to NestJS', description: 'Title of the content' })
  @IsString()
  title: string;

  @ApiPropertyOptional({ example: 'This video explains NestJS basics', description: 'Description of the content' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ enum: ContentType, example: ContentType.VOD, description: 'Type of content' })
  @IsEnum(ContentType)
  contentType: ContentType;

  @ApiPropertyOptional({ enum: ContentStatus, example: ContentStatus.PROCESSING, description: 'Current status of content' })
  @IsOptional()
  @IsEnum(ContentStatus)
  status?: ContentStatus;

  @ApiPropertyOptional({ example: 3600, description: 'Duration of the content in seconds' })
  @IsOptional()
  @IsInt()
  @Min(0)
  durationSeconds?: number;

  @ApiPropertyOptional({ example: 'https://cdn.example.com/video.m3u8', description: 'Playback URL for video' })
  @IsOptional()
  @IsUrl()
  playbackUrl?: string;

  @ApiPropertyOptional({ example: 'https://cdn.example.com/thumb.jpg', description: 'Thumbnail image URL' })
  @IsOptional()
  @IsUrl()
  thumbnailUrl?: string;

  @ApiPropertyOptional({ example: true, description: 'Whether this content is premium' })
  @IsOptional()
  @IsBoolean()
  isPremium?: boolean;

  @ApiPropertyOptional({ example: 'folder/object-key', description: 'R2 Object Key in storage' })
  @IsOptional()
  @IsString()
  r2ObjectKey?: string;

  @ApiProperty({ example: 'b768bfdc-2d0f-4fac-1234-abcdef', description: 'ID of the channel this content belongs to' })
  @IsString()
  channelId: string;
}
