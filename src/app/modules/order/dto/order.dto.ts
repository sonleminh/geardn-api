import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString, Length } from 'class-validator';
import { CustomerDto } from './customer.dto';
import { ShipmentDto } from './shipment';
import { AddressDto } from './address.dto';
import { PaymentDto } from './payment.dto';

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
  @IsNotEmpty({ message: 'Nội dung này không được để trống!' })
  @IsString()
  @Length(0, 30, { message: 'Độ dài từ 0-30 ký tự!' })
  model_id: string;

  @IsNotEmpty({ message: 'Nội dung này không được để trống!' })
  @IsString()
  @Length(0, 30, { message: 'Độ dài từ 0-30 ký tự!' })
  name: string;

  @IsNotEmpty({ message: 'Nội dung này không được để trống!' })
  @IsString()
  image: string;

  @IsNotEmpty({ message: 'Nội dung này không được để trống!' })
  @IsNumber()
  @IsPositive()
  price: number;

  @IsNotEmpty({ message: 'Nội dung này không được để trống!' })
  @IsString()
  product_id: string;

  @IsNotEmpty({ message: 'Nội dung này không được để trống!' })
  @IsString()
  @Length(0, 100, { message: 'Độ dài từ 0-100 ký tự!' })
  product_name: string;

  @IsNotEmpty({ message: 'Nội dung này không được để trống!' })
  @IsNumber()
  @IsPositive()
  quantity: number;
}

export class CreateOrderDto {
  @IsNotEmpty({ message: 'Nội dung này không được để trống!' })
  @IsString()
  @Length(0, 50, { message: 'Độ dài từ 0-50 ký tự!' })
  user: string;

  @IsNotEmpty({ message: 'Nội dung này không được để trống!' })
  items: any[];

  @IsNotEmpty({ message: 'Nội dung này không được để trống!' })
  customer: CustomerDto;

  @IsNotEmpty({ message: 'Nội dung này không được để trống!' })
  shipment: ShipmentDto;

  @IsNotEmpty({ message: 'Nội dung này không được để trống!' })
  address: AddressDto;

  @IsNotEmpty({ message: 'Nội dung này không được để trống!' })
  payment: PaymentDto;

  @IsOptional()
  @IsString()
  @Length(0, 100, { message: 'Độ dài từ 0-100 ký tự!' })
  note: string;
}

export class UpdateOrderDto {
  @IsNotEmpty({ message: 'Nội dung này không được để trống!' })
  @IsString()
  @Length(0, 30, { message: 'Độ dài từ 0-30 ký tự!' })
  name: string;

  @IsNotEmpty({ message: 'Nội dung này không được để trống!' })
  @IsNumber()
  items: OrderItemDto[];

  @IsNotEmpty({ message: 'Nội dung này không được để trống!' })
  @IsNumber()
  @IsPositive()
  total_amount: number;
}

export class StatusUpdateDto {
  @IsEnum(ORDER_STATUS)
  status: ORDER_STATUS;
}