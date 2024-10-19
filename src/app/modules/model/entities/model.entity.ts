import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Transform } from 'class-transformer';
import { HydratedDocument, Types } from 'mongoose';
import { STATUS } from '../dto/product-sku.dto';

export type ProductSkuDocument = HydratedDocument<ProductSku>;

@Schema({ collection: 'models', timestamps: true })
export class ProductSku {
  @Transform(({ value }) => value.toString(), { toPlainOnly: true })
  model_id: Types.ObjectId;

  @Prop({ require: true, type: String })
  product_id: string;

  @Prop({ require: true, type: String })
  name: string;

  @Prop({ require: true, type: Number })
  price: number;

  @Prop({ require: true, type: Number, default: 0 })
  stock: number;

  @Prop({
    enum: STATUS,
    require: true,
    type: String,
    default: STATUS.OUT_OF_STOCK,
  })
  status: string;
}

export const ProductSkuSchema = SchemaFactory.createForClass(ProductSku);