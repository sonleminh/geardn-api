import { IsArray, IsNotEmpty, IsOptional, IsString, Length } from 'class-validator';
import { TagsDto } from './tag.dto';

export class CreateProductDto {
  @IsNotEmpty({ message: 'Nội dung này không được để trống!' })
  @IsString()
  @Length(0, 490, { message: 'Độ dài tiêu đề từ 0-490 ký tự!' })
  name: string;

  @IsString()
  @Length(0)
  category_id: string;

  @Length(0)
  tags: string;

  @IsNotEmpty({ message: 'Nội dung này không được để trống!' })
  @IsString()
  @Length(1, 10000, { message: 'Độ dài đoạn tóm tắt từ 1-10000 ký tự!' })
  content: string;


  @IsOptional()
  thumbnail_image?: string | null;
}

export class UpdateProductDto {
  @IsOptional()
  @IsString()
  @Length(0, 490, { message: 'Độ dài tiêu đề từ 0-490 ký tự!' })
  name: string;

  @IsOptional()
  @IsString()
  @Length(1, 10000, { message: 'Độ dài đoạn tóm tắt từ 1-10000 ký tự!' })
  content: string;

  @IsOptional()
  thumbnail_image?: string | null;

  // @IsOptional()
  // @IsString()
  // @Length(0)
  // category_id: string;
}