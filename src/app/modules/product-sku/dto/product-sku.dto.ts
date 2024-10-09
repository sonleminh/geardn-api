import { Transform } from 'class-transformer';
import { IsArray, IsEnum, IsNotEmpty, IsOptional, IsString, Length } from 'class-validator';
import { Attribute } from '../../attribute/entities/attribute.entity';

export class CreateProductSkuDto {
  @IsNotEmpty({ message: 'Nội dung này không được để trống!' })
  @IsString()
  product_id: string;

  @IsNotEmpty({ message: 'Nội dung này không được để trống!' })
  @IsString()
  product_name: string;

  @IsNotEmpty({ message: 'Nội dung này không được để trống!' })
  @IsArray()
  attributes: Attribute[];

  @IsNotEmpty({ message: 'Nội dung này không được để trống!' })
  @IsString()
  @Length(0, 30, { message: 'Độ dài từ 0-30 ký tự!' })
  sku: string;

  @IsNotEmpty()
  @Transform(({ value }) => parseFloat(value))
  price: number;

  @IsNotEmpty()
  quantity: number;
}

export class UpdateProductSkuDto {
  @IsOptional({ message: 'Nội dung này không được để trống!' })
  @IsString()
  product_id: string;

  @IsOptional({ message: 'Nội dung này không được để trống!' })
  @IsString()
  product_name: string;

  @IsOptional({ message: 'Nội dung này không được để trống!' })
  @IsArray()

  attributes: Attribute[];

  @IsOptional({ message: 'Nội dung này không được để trống!' })
  @IsString()
  @Length(0, 30, { message: 'Độ dài từ 0-30 ký tự!' })
  sku: string;

  @IsOptional()
  @Transform(({ value }) => parseFloat(value))
  price: number;

  @IsOptional()
  quantity: number;
}