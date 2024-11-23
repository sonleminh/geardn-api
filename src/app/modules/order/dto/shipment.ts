import { IsDate, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString, Length } from 'class-validator';

export class ShipmentDto {
  @IsNotEmpty()
  @IsNumber()
  method: number;

  @IsNotEmpty()
  @IsString()
  @Length(0, 30, { message: 'Độ dài từ 0-30 ký tự!' })
  address: string;

  @IsNotEmpty()
  @IsString()
  receiver_name: string;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  receiver_phone: number;

  @IsOptional()
  @IsDate()
  delivery_date: Date;
}