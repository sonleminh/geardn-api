import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';
import { Types } from 'mongoose';
import { TYPE_ATTRIBUTE } from '../../attribute/dto/attribute.dto';
import { DetailsDto } from './details.dto';
import { DiscountDto } from './discount.dto';
import { TagsDto } from './tag.dto';

export class CreateProductDto {
  @IsNotEmpty({ message: 'Nội dung này không được để trống!' })
  @IsString()
  @Length(0, 100, { message: 'Độ dài tên từ 0-100 ký tự!' })
  name: string;

  // @IsOptional()
  // discount: DiscountDto;

  @IsNotEmpty()
  category: Types.ObjectId;

  @IsOptional()
  tags: TagsDto[];

  @IsNotEmpty()
  images?: string[];

  @IsOptional()
  @IsString()
  brand: string;

  @IsOptional()
  @IsString()
  @Length(1, 10000, { message: 'Độ dài đoạn mô tả từ 1-10000 ký tự!' })
  description: string;

  // @IsOptional()
  // @IsArray()
  // @IsEnum(TYPE_ATTRIBUTE, {
  //   message: `Vui lòng chọn 1 trong ${Object.values(TYPE_ATTRIBUTE).length} loại sau: ${Object.values(
  //     TYPE_ATTRIBUTE,
  //   ).join(' | ')}`,
  // })
  // attributes?: TYPE_ATTRIBUTE[];

  @IsNotEmpty({ message: 'Nội dung này không được để trống!' })
  @IsString()
  @Length(0, 30, { message: 'Độ dài tên từ 0-30 ký tự!' })
  sku_name: string;

  @IsOptional()
  details: DetailsDto;
}

export class UpdateProductDto {
  @IsString()
  @Length(0, 490, { message: 'Độ dài tiêu đề từ 0-490 ký tự!' })
  name: string;

  // @IsOptional()
  // discount: DiscountDto;

  @IsOptional()
  category: Types.ObjectId;

  @IsOptional()
  tags: TagsDto[];

  @IsOptional()
  images: string[];

  @IsOptional()
  @IsString()
  brand: string;

  // @IsOptional()
  // attributes: string[];

  // @IsOptional()
  // sku_name: string;

  @IsOptional()
  @IsString()
  @Length(1, 10000, { message: 'Độ dài đoạn mô tả từ 1-10000 ký tự!' })
  description: string;

  @IsOptional()
  details: DetailsDto;
}

export class UploadProductDto {
  @IsNotEmpty({ message: 'Nội dung này không được để trống!' })
  @IsString()
  @Length(0, 100, { message: 'Độ dài tên từ 0-100 ký tự!' })
  name: string;

  @IsNotEmpty()
  category: Types.ObjectId;

  @IsOptional()
  tags: TagsDto[];

  @IsNotEmpty()
  images?: string;

  @IsOptional()
  @IsString()
  brand: string;

  @IsOptional()
  @IsString()
  @Length(1, 10000, { message: 'Độ dài đoạn mô tả từ 1-10000 ký tự!' })
  description: string;

  // @IsOptional()
  // @IsArray()
  // attributes?: string;

  // @IsNotEmpty({ message: 'Nội dung này không được để trống!' })
  // @IsString()
  // @Length(0, 30, { message: 'Độ dài tên từ 0-30 ký tự!' })
  // sku_name: string;

  @IsOptional()
  details: DetailsDto;
}