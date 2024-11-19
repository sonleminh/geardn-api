// file: src/webhook/dto/create-webhook.dto.ts
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsDateString,
} from 'class-validator';

export class CreateTransactionDto {
  @IsNotEmpty()
  @IsNumber()
  id: number;

  @IsNotEmpty()
  @IsString()
  gateway: string;

  @IsNotEmpty()
  @IsDateString()
  transactionDate: Date;

  @IsOptional()
  @IsString()
  accountNumber?: string;

  @IsOptional()
  @IsString()
  subAccount?: string;

  @IsNotEmpty()
  @IsNumber()
  accumulated: number;

  @IsNotEmpty()
  @IsString()
  transferType: string;

  @IsNotEmpty()
  @IsNumber()
  transferAmount: number;

  @IsOptional()
  @IsString()
  code?: string;

  @IsOptional()
  @IsString()
  content?: string;

  @IsOptional()
  @IsString()
  referenceCode?: string;

  @IsOptional()
  @IsString()
  body?: string;

  @IsOptional()
  @IsString()
  description?: string;
}
