import { IsNotEmpty, IsString } from 'class-validator';

export class CreateGalleryDto {
  @IsString()
  @IsNotEmpty()
  image: string;
}
