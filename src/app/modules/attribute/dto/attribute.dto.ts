import { IsEnum, IsNotEmpty, IsOptional, IsString, Length } from 'class-validator';

export enum TYPE_ATTRIBUTE {
  COLOR = 'Màu sắc',
  SWITCH = 'Switch',
  SIZE = 'Kích cỡ',
  MEMORY = 'Bộ nhớ',
}

export class CreateAttributeDto {
  @IsNotEmpty({ message: 'Nội dung này không được để trống!' })
  @IsString()
  @Length(0, 30, { message: 'Độ dài từ 0-30 ký tự!' })
  @IsEnum(TYPE_ATTRIBUTE, {
    message: `Vui lòng chọn 1 trong ${Object.values(TYPE_ATTRIBUTE).length} loại sau: ${Object.values(
      TYPE_ATTRIBUTE,
    ).join(' | ')}`,
  })
  name: string;

  @IsNotEmpty({ message: 'Nội dung này không được để trống!' })
  @IsString()
  @Length(0, 30, { message: 'Độ dài từ 0-30 ký tự!' })
  value: string;

  @IsNotEmpty({ message: 'Nội dung này không được để trống!' })
  @IsString()
  @Length(0, 30, { message: 'Độ dài từ 0-30 ký tự!' })
  atb_sku: string;
}

export class UpdateAttributeDto {
  @IsOptional()
  @IsString()
  @Length(0, 30, { message: 'Độ dài từ 0-30 ký tự!' })
  type: string;

  @IsOptional()
  @IsString()
  @Length(0, 30, { message: 'Độ dài từ 0-30 ký tự!' })
  value: string;

  @IsOptional()
  @IsString()
  @Length(0, 30, { message: 'Độ dài từ 0-30 ký tự!' })
  atb_sku: string;
}