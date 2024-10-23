
import { IsNotEmpty } from 'class-validator';

export class ExtInfoDto {
  @IsNotEmpty()
  tier_index: string;

  @IsNotEmpty()
  is_pre_order: string;
}