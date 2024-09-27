import { Transform } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';

export class DiscountDto {
  @IsNotEmpty()
  @Transform(({ value }) => parseFloat(value))
  discountPrice: number;

  @IsNotEmpty()
  startDate: Date;

  @IsNotEmpty()
  endDate: Date;
}
