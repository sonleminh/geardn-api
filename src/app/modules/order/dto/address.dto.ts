import { IsEnum, IsNotEmpty, IsNumber, IsPositive, IsString, Length } from 'class-validator';

export class AddressDto {
  @IsNotEmpty({ message: 'Nội dung này không được để trống!' })
  @IsString()
  @Length(0, 30, { message: 'Độ dài từ 0-30 ký tự!' })
  city: string;

  @IsNotEmpty({ message: 'Nội dung này không được để trống!' })
  @IsString()
  @Length(0, 30, { message: 'Độ dài từ 0-30 ký tự!' })
  district: string;

  @IsNotEmpty({ message: 'Nội dung này không được để trống!' })
  @IsString()
  ward: string;

  @IsNotEmpty({ message: 'Nội dung này không được để trống!' })
  @IsNumber()
  @IsPositive()
  detail_address: number;
}