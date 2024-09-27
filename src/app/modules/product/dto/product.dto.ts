import { Transform } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsString, Length } from 'class-validator';
import { TagsDto } from './tag.dto';
import { DiscountDto } from './discount.dto';

export class CreateProductDto {
  @IsNotEmpty({ message: 'Nội dung này không được để trống!' })
  @IsString()
  @Length(0, 490, { message: 'Độ dài tên từ 0-490 ký tự!' })
  name: string;

  @IsNotEmpty()
  @Transform(({ value }) => parseFloat(value))
  price: number;

  @IsOptional()
  discount: DiscountDto;

  @IsString()
  @Length(0)
  category_id: string;

  @IsOptional()
  tags: TagsDto[];

  @IsNotEmpty()
  images?: string[];

  @IsNotEmpty({ message: 'Nội dung này không được để trống!' })
  @IsString()
  @Length(1, 10000, { message: 'Độ dài đoạn tóm tắt từ 1-10000 ký tự!' })
  content: string;
}

export class UpdateProductDto {
  @IsString()
  @Length(0, 490, { message: 'Độ dài tiêu đề từ 0-490 ký tự!' })
  name: string;

  @IsNotEmpty()
  @Transform(({ value }) => parseFloat(value))
  price: number;

  @IsOptional()
  discount: DiscountDto;

  @IsString()
  @Length(0)
  category_id: string;
  
  @IsOptional()
  tags: TagsDto[];

  @IsOptional()
  images?: string[];

  @IsOptional()
  @IsString()
  @Length(1, 10000, { message: 'Độ dài đoạn tóm tắt từ 1-10000 ký tự!' })
  content: string;
}