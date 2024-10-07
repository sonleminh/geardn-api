import { Transform } from 'class-transformer';
import { IsArray, IsEnum, IsNotEmpty, IsOptional, IsString, Length } from 'class-validator';
import { TagsDto } from './tag.dto';
import { DiscountDto } from './discount.dto';
import { CategoryDto } from './category.dto';
import { OptionDto } from './options.dto';
import { Variant } from '../entities/product.entity';
import { TYPE_ATTRIBUTE } from '../../attribute/dto/attribute.dto';

export class CreateProductDto {
  @IsNotEmpty({ message: 'Nội dung này không được để trống!' })
  @IsString()
  @Length(0, 490, { message: 'Độ dài tên từ 0-490 ký tự!' })
  name: string;

  // @IsOptional()
  // discount: DiscountDto;

  @IsNotEmpty()
  category: CategoryDto;

  @IsOptional()
  tags: TagsDto[];

  @IsNotEmpty()
  images?: string[];

  @IsOptional()
  variant: Variant[];

  @IsNotEmpty({ message: 'Nội dung này không được để trống!' })
  @IsString()
  @Length(1, 10000, { message: 'Độ dài đoạn tóm tắt từ 1-10000 ký tự!' })
  content: string;

  @IsOptional()
  @IsArray()
  @IsEnum(TYPE_ATTRIBUTE, {
    message: `Vui lòng chọn 1 trong ${Object.values(TYPE_ATTRIBUTE).length} loại sau: ${Object.values(
      TYPE_ATTRIBUTE,
    ).join(' | ')}`,
  })
  attributes: TYPE_ATTRIBUTE[];
}

export class UpdateProductDto {
  @IsString()
  @Length(0, 490, { message: 'Độ dài tiêu đề từ 0-490 ký tự!' })
  name: string;

  @IsOptional()
  discount: DiscountDto;

  @IsNotEmpty()
  category: CategoryDto;
  
  @IsOptional()
  tags: TagsDto[];

  @IsOptional()
  images: string[];

  @IsOptional()
  variant: Variant[];

  @IsOptional()
  @IsString()
  @Length(1, 10000, { message: 'Độ dài đoạn tóm tắt từ 1-10000 ký tự!' })
  content: string;

  @IsOptional()
  attributes: string[];
}