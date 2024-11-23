import { IsDate, IsEnum, IsNotEmpty, IsNumber, IsPositive, IsString, Length } from 'class-validator';

export class PaymentDto {
  @IsNotEmpty()
  @IsString()
  @Length(0, 30, { message: 'Độ dài từ 0-30 ký tự!' })
  method: string;

  // @IsNotEmpty()
  // @IsString()
  // @Length(0, 30, { message: 'Độ dài từ 0-30 ký tự!' })
  // address: string;

  // @IsNotEmpty()
  // @IsString()
  // receiver_name: string;

  // @IsNotEmpty()
  // @IsNumber()
  // @IsPositive()
  // receiver_phone: number;

  // @IsNotEmpty()
  // @IsDate()
  // @IsPositive()
  // delivery_date: Date;
}