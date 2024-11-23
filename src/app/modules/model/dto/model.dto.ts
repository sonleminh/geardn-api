import { Transform } from 'class-transformer';
import { IsArray, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, Length, Max, Min } from 'class-validator';
import { Attribute } from '../../attribute/entities/attribute.entity';
import { ExtInfoDto } from './extinfo.dto';

export class CreateModelDto {
  @IsNotEmpty()
  @IsString()
  product: string;

  @IsOptional()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  sku: string;

  @IsNotEmpty()
  @IsNumber()
  price: number;

  @IsNotEmpty()
  @IsNumber({}, { message: 'Tồn kho phải là một số!' })
  @Min(0, { message: 'Tồn kho phải lớn hơn hoặc bằng 0!' })
  stock: number;

  @IsNotEmpty()
  extinfo: ExtInfoDto
}

export class UpdateModelDto {
  @IsOptional()
  @IsString()
  product: string;

  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  sku: string;

  @IsOptional()
  @IsNumber()
  price: number;

  @IsOptional()
  @IsNumber({}, { message: 'Tồn kho phải là một số!' })
  @Min(0, { message: 'Tồn kho phải lớn hơn hoặc bằng 0!' })
  stock: number;

  @IsOptional()
  extinfo: ExtInfoDto
}