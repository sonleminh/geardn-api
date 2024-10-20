import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class VariantDTO  {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  options: string[];

  @IsOptional()
  images: string[];
}
