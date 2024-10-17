import { IsNotEmpty, IsNumber, IsString, Length } from 'class-validator';

export class CreateCartDto {
  @IsNotEmpty({ message: 'Nội dung này không được để trống!' })
  @IsString()
  @Length(0, 30, { message: 'Độ dài từ 0-30 ký tự!' })
  sku: string;

  @IsNotEmpty({ message: 'Nội dung này không được để trống!' })
  @IsString()
  product_name: string;

  @IsNotEmpty({ message: 'Nội dung này không được để trống!' })
  @IsNumber()
  quantity: string;

  @IsNotEmpty({ message: 'Nội dung này không được để trống!' })
  @IsNumber()
  price: string;
}

export class UpdateCartDto {
  // @IsOptional()
  // @IsString()
  // @Length(0, 30, { message: 'Độ dài từ 0-30 ký tự!' })
  // name: string;

  // @IsOptional()
  // @IsString()
  // @Length(0, 30, { message: 'Độ dài từ 0-30 ký tự!' })
  // value: string;

  // @IsOptional()
  // @IsString()
  // @Length(0, 30, { message: 'Độ dài từ 0-30 ký tự!' })
  // atb_sku: string;
}