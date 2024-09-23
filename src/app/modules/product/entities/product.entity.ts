import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Transform } from 'class-transformer';
import { Types } from 'mongoose';
import { Category } from '../../category/entities/category.entity';
import { TagsDto } from '../dto/tag.dto';


@Schema({ collection: 'products', timestamps: true })
export class Product {
  @Transform(({ value }) => value.toString(), { toPlainOnly: true })
  _id: Types.ObjectId;

  @Prop({ required: true })
  name: string;

  @Prop({ type: Types.ObjectId, ref: Category.name })
  category_id: string;

  @Prop({ required: true })
  tags: TagsDto[];
  
  @Prop({})
  thumbnail_image: string;
  
  @Prop({ required: true })
  content: string;

  @Prop({ default: false })
  is_deleted: boolean;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
