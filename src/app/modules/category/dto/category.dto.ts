import { IsNotEmpty, IsOptional, IsString, Length } from 'class-validator';

export class CreateCategoryDto {
  @IsNotEmpty()
  @IsString()
  @Length(0, 30, { message: 'Độ dài tiêu đề từ 0-30 ký tự!' })
  name: string;
}

export class UpdateCategoryDto {
  @IsOptional()
  @IsString()
  @Length(1, 1000, { message: 'Độ dàitừ 1-50 ký tự!' })
  name: string;
}