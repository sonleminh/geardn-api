import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Transform } from 'class-transformer';
import { HydratedDocument, Types } from 'mongoose';
import { Attribute } from '../../attribute/entities/attribute.entity';
import { STATUS } from '../dto/product-sku.dto';

export type ProductSkuDocument = HydratedDocument<ProductSku>;

@Schema({ collection: 'product-skus', timestamps: true })
export class ProductSku {
  @Transform(({ value }) => value.toString(), { toPlainOnly: true })
  _id: Types.ObjectId;

  @Prop({ require: true, type: String })
  product_id: string;

  @Prop({ require: true, type: String })
  product_name: string;

  @Prop({ type: Types.ObjectId, ref: Attribute.name })
  attributes: Attribute[];

  @Prop({ require: true, type: String })
  sku: string;

  @Prop({ require: true, type: Number })
  price: number;

  @Prop({ require: true, type: Number, default: 0 })
  quantity: number;

  @Prop({
    enum: STATUS,
    require: true,
    type: String,
    default: STATUS.OUT_OF_STOCK,
  })
  status: string;
}

export const ProductSkuSchema = SchemaFactory.createForClass(ProductSku);