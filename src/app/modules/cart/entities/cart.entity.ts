import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Model } from '../../model/entities/model.entity';


export type CartDocument = HydratedDocument<Cart>;

// Define the item sub-schema
@Schema({ _id: false })
export class CartItem {
  @Prop({ type: Types.ObjectId, ref: Model.name })
  model: string;

  @Prop({ required: true })
  quantity: number;
}

// Create the schema for the items array
export const CartItemSchema = SchemaFactory.createForClass(CartItem);

@Schema({ collection: 'carts', timestamps: true })
export class Cart {
  @Prop({ default: null })
  user_id: string;

  // Define an array of CartItem sub-schema
  @Prop({ type: [CartItemSchema], default: [] })
  items: CartItem[];
}

export const CartSchema = SchemaFactory.createForClass(Cart);