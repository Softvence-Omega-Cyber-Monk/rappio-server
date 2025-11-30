import { PartialType } from '@nestjs/swagger';
import { CreateWatchHistoryDto } from './create-watch-history.dto';
import { IsOptional, IsInt, Min } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateWatchHistoryDto extends PartialType(CreateWatchHistoryDto) {
  @ApiPropertyOptional({ example: 240 })
  @IsOptional()
  @IsInt()
  @Min(0)
  progressSeconds?: number;
}
