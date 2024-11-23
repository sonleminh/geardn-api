import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';

export class CreatePaymentMethodDto {
  @IsNotEmpty()
  @IsString()
  @Length(0, 30, { message: 'Độ dài tiêu đề từ 0-30 ký tự!' })
  key: string;

  @IsNotEmpty()
  @IsString()
  @Length(0, 30, { message: 'Độ dài tiêu đề từ 0-30 ký tự!' })
  name: string;

  @IsNotEmpty()
  @IsString()
  image: string;

  @IsOptional()
  @IsBoolean()
  is_disabled: string;
}

export class UpdatePaymentMethodDto {
  @IsNotEmpty()
  @IsString()
  @Length(0, 30, { message: 'Độ dài tiêu đề từ 0-30 ký tự!' })
  key: string;

  @IsNotEmpty()
  @IsString()
  @Length(0, 30, { message: 'Độ dài tiêu đề từ 0-30 ký tự!' })
  name: string;

  @IsNotEmpty()
  @IsString()
  image: string;

  @IsOptional()
  @IsBoolean()
  is_disabled: string;
}
