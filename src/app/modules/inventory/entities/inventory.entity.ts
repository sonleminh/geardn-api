// import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
// import { HydratedDocument, Types } from 'mongoose';
// import { STATUS } from '../dto/inventory.dto';
// import { ProductSku } from '../../product-sku/entities/product-sku.entity';
// import { ObjectIdParamDto } from 'src/app/dtos/object-id.dto';
// import { Transform } from 'class-transformer';

// export type InventoryDocument = HydratedDocument<Inventory>;

// @Schema({ collection: 'inventories', timestamps: true })
// export class Inventory {
//   @Prop({ require: true, type: String })
//   @Transform(({ value }) => value.toString(), { toPlainOnly: true })
//   sku_id: Types.ObjectId;

//   @Prop({ require: true, type: String })
//   product_name: string;

//   @Prop({ require: true, type: String })
//   sku: string;

//   @Prop({ require: true, type: Number, default: 0 })
//   quantity: number;

//   @Prop({
//     enum: STATUS,
//     require: true,
//     type: String,
//     default: STATUS.OUT_OF_STOCK,
//   })
//   status: string;
// }

// export const InventorySchema = SchemaFactory.createForClass(Inventory);