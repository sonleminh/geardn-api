import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString, Length } from 'class-validator';
import { CustomerDto } from './customer.dto';
import { ShipmentDto } from './shipment';
import { AddressDto } from './address.dto';
import { PaymentDto } from './payment.dto';
import { FlagDto } from './flag';

export enum ORDER_STATUS {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  SHIPPING = 'shipping',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  RETURNED = 'returned',
}

export enum RECEIVE_OPTION {
  DELIVERY = 'delivery',
  STORE = 'store',
}

export class OrderItemDto {
  @IsNotEmpty()
  @IsString()
  @Length(0, 30, { message: 'Độ dài từ 0-30 ký tự!' })
  model_id: string;

  @IsNotEmpty()
  @IsString()
  @Length(0, 30, { message: 'Độ dài từ 0-30 ký tự!' })
  name: string;

  @IsNotEmpty()
  @IsString()
  image: string;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  price: number;

  @IsNotEmpty()
  @IsString()
  product_id: string;

  @IsNotEmpty()
  @IsString()
  @Length(0, 100, { message: 'Độ dài từ 0-100 ký tự!' })
  product_name: string;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  quantity: number;
}

export class CreateOrderDto {
  @IsOptional()
  @IsString()
  @Length(0, 50, { message: 'Độ dài từ 0-50 ký tự!' })
  user: string;

  @IsNotEmpty()
  items: any[];

  @IsNotEmpty()
  customer: CustomerDto;

  @IsNotEmpty()
  shipment: ShipmentDto;

  // @IsNotEmpty()
  // address: AddressDto;

  @IsNotEmpty()
  payment: PaymentDto;

  @IsNotEmpty()
  flag: FlagDto;

  @IsOptional()
  @IsString()
  @Length(0, 100, { message: 'Độ dài từ 0-100 ký tự!' })
  note: string;
}

export class UpdateOrderDto {
  @IsNotEmpty()
  @IsString()
  @Length(0, 30, { message: 'Độ dài từ 0-30 ký tự!' })
  name: string;

  @IsNotEmpty()
  @IsNumber()
  items: OrderItemDto[];

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  total_amount: number;
}

export class StatusUpdateDto {
  @IsEnum(ORDER_STATUS)
  status: ORDER_STATUS;
}