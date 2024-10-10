// import {
//   BadRequestException,
//   Injectable,
//   NotFoundException,
// } from '@nestjs/common';
// import { InjectModel } from '@nestjs/mongoose';

// import { Model } from 'mongoose';
// import { Inventory } from './entities/inventory.entity';
// import { CreateInventoryDto, UpdateInventoryDto } from './dto/inventory.dto';
// import { ProductService } from '../product/product.service';
// import { AttributeService } from '../attribute/attribute.service';
// import { CategoryService } from '../category/category.service';

// @Injectable()
// export class InventoryService {
//   constructor(
//     @InjectModel(Inventory.name) private InventoryModel: Model<Inventory>,
//     private readonly categoryService: CategoryService,
//     private readonly productService: ProductService,
//     private readonly attributeService: AttributeService,
//   ) {}

//   async create(body: CreateInventoryDto) {
//     try {
//       return await this.InventoryModel.create(body);
//     } catch (error) {
//       throw error;
//     }
//   }

//   async findAll() {
//     try {
//       const [res, total] = await Promise.all([
//         this.InventoryModel.find().lean().exec(),
//         this.InventoryModel.countDocuments(),
//       ]);
//       return { inventoryList: res, total };
//     } catch (error) {
//       throw new BadRequestException(error);
//     }
//   }

//    // async findById(id: string) {
//   //   try {
//   //     const res = await this.InventoryModel.findById(id);
//   //     if (!res) {
//   //       throw new NotFoundException('Không tìm thấy SKU!');
//   //     }
//   //     return res;
//   //   } catch {
//   //     throw new NotFoundException('Không tìm thấy SKU!');
//   //   }
//   // }

//   async findByProductId(id: string) {
//     try {
//       const res = await this.InventoryModel.find({ sku_id: id });
//       if (!res) {
//         throw new NotFoundException('Không tìm thấy SKU!');
//       }
//       return res;
//     } catch {
//       throw new NotFoundException('Không tìm thấy SKU!');
//     }
//   }

//   // async initialForCreate() {
//   //   const [categoryList, attributeList] = await Promise.all([
//   //     await this.productService.getCategoriesWithProducts(),
//   //     await this.attributeService.getInitialAttributeList(),
//   //   ]);

//   //   return { categoryList, attributeList };
//   // }

//   // async update(id: string, body: UpdateInventoryDto): Promise<Inventory> {
//   //   const entity = await this.InventoryModel.findById({ _id: id })
//   //     .where({ is_deleted: { $ne: true } })
//   //     .lean();
//   //   if (!entity) {
//   //     throw new NotFoundException(`Đối tượng này không tồn tại!!`);
//   //   }

//   //   return await this.InventoryModel.findByIdAndUpdate(
//   //     id,
//   //     { ...entity, ...body },
//   //     { new: true },
//   //   ).exec();
//   // }

//   // async remove(id: string): Promise<{ deletedCount: number }> {
//   //   const entity = await this.InventoryModel.findById(id).lean();
//   //   if (!entity) {
//   //     throw new NotFoundException('Đối tượng không tồn tại!!');
//   //   }

//   //   const result = await this.InventoryModel.deleteOne({ _id: id }).exec();

//   //   return {
//   //     deletedCount: result.deletedCount,
//   //   };
//   // }
// }
