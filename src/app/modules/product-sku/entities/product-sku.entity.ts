import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Transform } from 'class-transformer';
import { HydratedDocument, Types } from 'mongoose';

export type ProductSkuDocument = HydratedDocument<ProductSku>;

@Schema({ collection: 'product-skus', timestamps: true })
export class ProductSku {
  @Transform(({ value }) => value.toString(), { toPlainOnly: true })
  _id: Types.ObjectId;

  @Prop({ require: true, type: String })
  product_id: string;

  @Prop({ require: true, type: String })
  attribute_id: string;

  @Prop({ require: true, unique: true, type: String })
  sku: string;

  @Prop({ require: true, type: Number })
  price: number;

  @Prop({ require: true, type: Number })
  quantity: number;
}

export const ProductSkuSchema = SchemaFactory.createForClass(ProductSku);