import { IsDate, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString, Length } from 'class-validator';

export class ShipmentDto {
  @IsNotEmpty({ message: 'Nội dung này không được để trống!' })
  @IsNumber()
  method: number;

  @IsNotEmpty({ message: 'Nội dung này không được để trống!' })
  @IsString()
  @Length(0, 30, { message: 'Độ dài từ 0-30 ký tự!' })
  address: string;

  @IsNotEmpty({ message: 'Nội dung này không được để trống!' })
  @IsString()
  receiver_name: string;

  @IsNotEmpty({ message: 'Nội dung này không được để trống!' })
  @IsNumber()
  @IsPositive()
  receiver_phone: number;

  @IsOptional()
  @IsDate()
  delivery_date: Date;
}