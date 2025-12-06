import { IsString, IsOptional } from 'class-validator';

export class UpdateLiveCommentDto {
  @IsString()
  @IsOptional()
  message?: string;
}
