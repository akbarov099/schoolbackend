import { IsIn, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateTeacherDto {
  @IsString()
  @IsNotEmpty()
  full_name: string;

  @IsString()
  @IsOptional()
  subject?: string;

  @IsIn(['Teacher', 'Personal'])
  @IsOptional()
  type?: string;

  @IsString()
  @IsOptional()
  image?: string;

  @IsString()
  @IsOptional()
  resume?: string;
}
