// import { Transform } from 'class-transformer';
// import { IsArray, IsEnum, IsNotEmpty, IsOptional, IsString, Length } from 'class-validator';
// import { Attribute } from '../../attribute/entities/attribute.entity';
// import {  Types } from 'mongoose';

// export enum STATUS {
//   IN_STOCK = 'in_stock',
//   OUT_OF_STOCK = 'out_of_stock',
//   PRE_ORDER = 'pre_order',
// }

// export class CreateInventoryDto {
//   @IsNotEmpty({ message: 'Nội dung này không được để trống!' })
//   @Transform(({ value }) => value.toString(), { toPlainOnly: true })
//   @IsString()
//   sku_id: Types.ObjectId;

//   @IsNotEmpty({ message: 'Nội dung này không được để trống!' })
//   @IsString()
//   product_name: string;

//   @IsNotEmpty({ message: 'Nội dung này không được để trống!' })
//   @IsString()
//   @Length(0, 30, { message: 'Độ dài từ 0-30 ký tự!' })
//   sku: string;
// }

// export class UpdateInventoryDto {
//   @IsOptional({ message: 'Nội dung này không được để trống!' })
//   @IsString()
//   sku_id: string;

//   @IsOptional({ message: 'Nội dung này không được để trống!' })
//   @IsString()
//   product_name: string;

//   @IsOptional({ message: 'Nội dung này không được để trống!' })
//   @IsString()
//   @Length(0, 30, { message: 'Độ dài từ 0-30 ký tự!' })
//   sku: string;

//   @IsOptional()
//   quantity: number;
// }