import { IsEnum, IsNotEmpty, IsNumber, IsPositive, IsString, Length } from 'class-validator';

export class AddressDto {
  @IsNotEmpty({ message: 'Tỉnh/Thành phố không được để trống!' })
  @IsString()
  @Length(0, 30, { message: 'Độ dài từ 0-30 ký tự!' })
  city: string;

  @IsNotEmpty({ message: 'Quận/Huyện không được để trống!' })
  @IsString()
  @Length(0, 30, { message: 'Độ dài từ 0-30 ký tự!' })
  district: string;

  @IsNotEmpty({ message: 'Phường/Xã không được để trống!' })
  @IsString()
  ward: string;

  @IsNotEmpty({ message: 'Địa chỉ nhận hàng không được để trống!' })
  @IsNumber()
  @IsPositive()
  detail_address: number;
}