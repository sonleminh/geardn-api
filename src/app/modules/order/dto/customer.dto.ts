import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString, Length } from 'class-validator';

export class CustomerDto {
  @IsNotEmpty({ message: 'Tên người đặt hàng không được để trống!' })
  @IsString()
  @Length(0, 30, { message: 'Độ dài từ 0-30 ký tự!' })
  name: string;

  @IsOptional({ message: 'Số điện thoại đặt hàng không được để trống!' })
  @IsString()
  @Length(0, 30, { message: 'Độ dài từ 0-30 ký tự!' })
  phone: string;

  @IsNotEmpty({ message: 'Mail đặt hàng không được để trống!' })
  @IsString()
  mail: string;
}