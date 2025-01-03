import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Transform } from 'class-transformer';
import { Types } from 'mongoose';
import { Category } from '../../category/entities/category.entity';
import { TagsDto } from '../dto/tag.dto';
import { Document } from 'mongoose';
@Schema({ _id: false })
export class Discount extends Document {
  @Prop({ required: true })
  discountPrice: number;

  @Prop({ required: true })
  startDate: Date;

  @Prop({ required: true })
  endDate: Date;
}

class Details {
  @Prop()
  guarantee: string;
  
  @Prop()
  weight: string;

  @Prop()
  material: string;
}

@Schema({ _id: false })
export class TierVariant extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  options: string[];

  @Prop()
  images: string[];
}

@Schema({ collection: 'products', timestamps: true })
export class Product {
  @Transform(({ value }) => value.toString(), { toPlainOnly: true })
  _id: Types.ObjectId;

  @Prop({ require: true, unique: true })
  name: string;

  // @Prop({ type: Discount })
  // discount: Discount;

  @Prop({ type: Types.ObjectId, ref: Category.name })
  category: Types.ObjectId;

  @Prop({ required: true })
  tags: TagsDto[];

  @Prop({ required: true })
  images: string[];

  @Prop()
  tier_variations: TierVariant[];

  @Prop({ require: true, unique: true })
  sku_name: string;

  // @Prop({ default: undefined })
  // attributes: TYPE_ATTRIBUTE[];

  @Prop({ default: 'Không' })
  brand: string;

  @Prop({ type: Details })
  details: Details;

  @Prop({})
  description: string;

  @Prop({ require: true, unique: true })
  slug: string;

  @Prop({ default: false })
  is_deleted: boolean;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
