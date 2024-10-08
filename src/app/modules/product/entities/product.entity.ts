import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Transform } from 'class-transformer';
import { Types } from 'mongoose';
import { Category } from '../../category/entities/category.entity';
import { TagsDto } from '../dto/tag.dto';
import { Document } from 'mongoose';
import { ProductSku } from '../../product-sku/entities/product-sku.entity';
import { TYPE_ATTRIBUTE } from '../../attribute/dto/attribute.dto';
@Schema({ _id: false })
export class Discount extends Document {
  @Prop({ required: true })
  discountPrice: number;

  @Prop({ required: true })
  startDate: Date;

  @Prop({ required: true })
  endDate: Date;
}

export class Variant extends Document {
  @Prop({ type: Map, of: String, required: true })
  option: Record<string, string>;

  @Prop({ required: true })
  price: number;
}

@Schema({ collection: 'products', timestamps: true })
export class Product {
  @Transform(({ value }) => value.toString(), { toPlainOnly: true })
  _id: Types.ObjectId;

  @Prop({ required: true, unique: true })
  name: string;

  // @Prop({ type: Discount })
  // discount: Discount;

  @Prop({ type: Types.ObjectId, ref: Category.name })
  category: Category;

  @Prop({ required: true })
  tags: TagsDto[];

  @Prop({ required: true })
  images: string[];

  @Prop({ default: undefined })
  attributes: TYPE_ATTRIBUTE[];

  @Prop({ default: 'Không' })
  brand: string;

  @Prop({ required: true })
  specs: TagsDto[];

  @Prop({ required: true })
  content: string;

  @Prop({ default: false })
  is_deleted: boolean;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
