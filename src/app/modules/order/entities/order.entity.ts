import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';


export type OrderDocument = HydratedDocument<Order>;

// Define the item sub-schema
@Schema({ _id: false })
export class OrderItem {
  @Prop({ type: Types.ObjectId, ref: 'Model', required: true })
  model_id: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Product', required: true })
  product_id: Types.ObjectId;

  @Prop({ required: true })
  product_name: string;

  @Prop()
  name: string;

  @Prop({ required: true })
  image: string;

  @Prop({ required: true })
  quantity: number;

  @Prop({ required: true })
  price: number;
}

export class Customer {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  phone: string;

  @Prop({ required: true })
  mail: string;
}

export class Shipment {
  @Prop({ required: true })
  method: number;

  @Prop({ required: true })
  address: string;

  @Prop()
  delivery_date: Date;
}

export class Address {
  @Prop()
  city: string;

  @Prop()
  district: string;

  @Prop()
  ward: string;

  @Prop()
  detail_address: string;
}

export class Payment {
  @Prop({ type: Types.ObjectId, required: true, ref: 'Payment-methods' })
  method: Types.ObjectId;
}

export class Flag {
  @Prop({ default: false })
  is_online_order: boolean;
}

// Create the schema for the items array
export const OrderItemSchema = SchemaFactory.createForClass(OrderItem);

@Schema({ collection: 'orders', timestamps: true })
export class Order {
  @Prop({ ref: 'User' })
  user: string;

  @Prop({ type: [OrderItemSchema], required: true })
  items: OrderItem[];

  @Prop({ required: true })
  customer: Customer;

  @Prop({ required: true })
  shipment: Shipment;

  // @Prop({ required: true })
  // address: Address;

  @Prop({ required: true })
  payment: Payment;

  @Prop({ required: true })
  flag: Flag;

  @Prop({})
  note: string;

  @Prop({ required: true })
  total_amount: number;

  @Prop({ default: 'pending' })
  status: string;
}

export const OrderSchema = SchemaFactory.createForClass(Order);