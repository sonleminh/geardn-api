import { IsNotEmpty, IsOptional, IsString, Length } from 'class-validator';

export class CreatePaymentMethodDto {
  @IsNotEmpty({ message: 'Nội dung này không được để trống!' })
  @IsString()
  @Length(0, 30, { message: 'Độ dài tiêu đề từ 0-30 ký tự!' })
  name: string;
}

export class UpdatePaymentMethodDto {
  @IsOptional()
  @IsString()
  @Length(1, 1000, { message: 'Độ dài từ 1-50 ký tự!' })
  name: string;
}