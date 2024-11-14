
import { IsNotEmpty } from 'class-validator';

export class ExtInfoDto {
  @IsNotEmpty()
  tier_index: number[];

  @IsNotEmpty()
  is_pre_order: string;
}