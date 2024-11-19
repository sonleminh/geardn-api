import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';

export class CreatePaymentMethodDto {
  @IsNotEmpty({ message: 'Nội dung này không được để trống!' })
  @IsString()
  @Length(0, 30, { message: 'Độ dài tiêu đề từ 0-30 ký tự!' })
  key: string;

  @IsNotEmpty({ message: 'Nội dung này không được để trống!' })
  @IsString()
  @Length(0, 30, { message: 'Độ dài tiêu đề từ 0-30 ký tự!' })
  name: string;

  @IsNotEmpty({ message: 'Nội dung này không được để trống!' })
  @IsString()
  image: string;

  @IsOptional({ message: 'Nội dung này không được để trống!' })
  @IsBoolean()
  is_disabled: string;
}

export class UpdatePaymentMethodDto {
  @IsNotEmpty({ message: 'Nội dung này không được để trống!' })
  @IsString()
  @Length(0, 30, { message: 'Độ dài tiêu đề từ 0-30 ký tự!' })
  key: string;

  @IsNotEmpty({ message: 'Nội dung này không được để trống!' })
  @IsString()
  @Length(0, 30, { message: 'Độ dài tiêu đề từ 0-30 ký tự!' })
  name: string;

  @IsNotEmpty({ message: 'Nội dung này không được để trống!' })
  @IsString()
  image: string;

  @IsOptional({ message: 'Nội dung này không được để trống!' })
  @IsBoolean()
  is_disabled: string;
}
