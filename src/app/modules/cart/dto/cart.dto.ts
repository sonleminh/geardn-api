import { IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString, Length } from 'class-validator';

export class UpsertCartDto {
  @IsOptional()
  @IsString()
  @Length(0, 30, { message: 'Độ dài từ 0-30 ký tự!' })
  user_id: string;

  @IsNotEmpty()
  @IsString()
  @Length(0, 30, { message: 'Độ dài từ 0-30 ký tự!' })
  model: string;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  quantity: number;
}

export class UpdateCartDto {
  @IsNotEmpty()
  @IsString()
  @Length(0, 30, { message: 'Độ dài từ 0-30 ký tự!' })
  model: string;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  quantity: number;
}