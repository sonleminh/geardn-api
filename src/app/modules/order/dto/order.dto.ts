import { IsNotEmpty, IsNumber, IsString, Length } from 'class-validator';

export class UpsertCartDto {
  @IsNotEmpty({ message: 'Nội dung này không được để trống!' })
  @IsString()
  @Length(0, 30, { message: 'Độ dài từ 0-30 ký tự!' })
  model: string;

  @IsNotEmpty({ message: 'Nội dung này không được để trống!' })
  @IsNumber()
  quantity: number;
}

export class UpdateCartDto {
  @IsNotEmpty({ message: 'Nội dung này không được để trống!' })
  @IsString()
  @Length(0, 30, { message: 'Độ dài từ 0-30 ký tự!' })
  model: string;

  @IsNotEmpty({ message: 'Nội dung này không được để trống!' })
  @IsNumber()
  quantity: number;
}