import { IsString, IsNotEmpty } from 'class-validator';

export class CreateLiveCommentDto {
  @IsString()
  @IsNotEmpty()
  videoId: string;

  @IsString()
  @IsNotEmpty()
  message: string;
}
