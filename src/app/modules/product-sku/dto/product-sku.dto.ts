import { Transform } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsOptional, IsString, Length } from 'class-validator';

export class CreateProductSkuDto {
  @IsNotEmpty({ message: 'Nội dung này không được để trống!' })
  @IsString()
  product_id: string;

  @IsNotEmpty({ message: 'Nội dung này không được để trống!' })
  @IsString()
  attribute_id: string;

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
  attribute_id: string;

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