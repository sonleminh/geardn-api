import { IsNotEmpty, IsString } from 'class-validator';

export class OptionDto {
  @IsNotEmpty()
  @IsString()
  value: string;

  @IsNotEmpty()
  @IsString()
  label: string;
}
