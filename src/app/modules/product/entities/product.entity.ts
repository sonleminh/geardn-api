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

@Schema({ _id: false })
export class Image extends Document {
  @Prop({ required: true })
  url: string;
}
@Schema({ collection: 'products', timestamps: true })
export class Product {
  @Transform(({ value }) => value.toString(), { toPlainOnly: true })
  _id: Types.ObjectId;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  price: number;

  @Prop({ type: Discount })
  discount: Discount;

  @Prop({ type: Types.ObjectId, ref: Category.name })
  category_id: string;

  @Prop({ required: true })
  tags: TagsDto[];
  
  @Prop({})
  images: Image[];
  
  @Prop({ required: true })
  content: string;

  @Prop({ default: false })
  is_deleted: boolean;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
