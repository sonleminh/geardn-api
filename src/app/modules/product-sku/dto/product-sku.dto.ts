import { Transform } from 'class-transformer';
import { IsArray, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, Length, Max, Min } from 'class-validator';
import { Attribute } from '../../attribute/entities/attribute.entity';

export enum STATUS {
  IN_STOCK = 'IN_STOCK',
  OUT_OF_STOCK = 'OUT_OF_STOCK',
  PRE_ORDER = 'PRE_ORDER',
}


export class CreateProductSkuDto {
  @IsNotEmpty({ message: 'Nội dung này không được để trống!' })
  @IsString()
  product_id: string;

  @IsNotEmpty({ message: 'Nội dung này không được để trống!' })
  @IsString()
  product_name: string;

  @IsNotEmpty({ message: 'Nội dung này không được để trống!' })
  @IsString()
  product_sku: string;

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
  @IsNumber({}, { message: 'Số lượng phải là một số!' })
  @Min(0, { message: 'Số lượng phải lớn hơn hoặc bằng 0!' })
  quantity: number;

  @IsOptional()
  @IsString()
  status: string;
}

export class UpdateProductSkuDto {
  @IsOptional({ message: 'Nội dung này không được để trống!' })
  @IsString()
  product_id: string;

  @IsOptional({ message: 'Nội dung này không được để trống!' })
  @IsString()
  product_name: string;

  @IsOptional({ message: 'Nội dung này không được để trống!' })
  @IsString()
  product_sku: string;

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
  @IsNumber({}, { message: 'Số lượng phải là một số!' })
  @Min(0, { message: 'Số lượng phải lớn hơn hoặc bằng 0!' })
  quantity: number;

  @IsOptional()
  @IsString()
  status: string;
}