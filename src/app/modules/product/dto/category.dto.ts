import { IsNotEmpty, IsString } from 'class-validator';


export class CategoryDto {
  @IsNotEmpty()
  @IsString()
  _id: string;

  @IsNotEmpty()
  @IsString()
  value: string;

  @IsNotEmpty()
  @IsString()
  label: string;
}
