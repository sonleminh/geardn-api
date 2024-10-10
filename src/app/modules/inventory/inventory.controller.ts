// import {
//   Body,
//   Controller,
//   Delete,
//   Get,
//   HttpCode,
//   HttpStatus,
//   Param,
//   Patch,
//   Post,
//   UseGuards,
// } from '@nestjs/common';
// import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
// import { ObjectIdParamDto } from 'src/app/dtos/object-id.dto';
// import { RoleGuard } from '../auth/guards/role.guard';
// import { Roles } from 'src/app/decorators/role.decorator';
// import { RBAC } from 'src/app/enums/rbac.enum';
// import { InventoryService } from './inventory.service';
// import { CreateInventoryDto } from './dto/inventory.dto';

// @Controller('inventory')
// @UseGuards(JwtAuthGuard)
// export class InventoryController {
//   constructor(private inventoryService: InventoryService) {}

//   @Post('/')
//   @UseGuards(JwtAuthGuard, RoleGuard)
//   @Roles(RBAC.ADMIN)
//   async createInventory(@Body() body: any) {
//     return await this.inventoryService.create(body);
//   }

//   @Get()
//   async getAllInventory() {
//     return this.inventoryService.findAll();
//   }

//   // @Get('initial-for-create')
//   // async findInitial() {
//   //   return await this.InventoryService.initialForCreate();
//   // }

//   @Get('/product/:id')
//   @HttpCode(HttpStatus.OK)
//   async findByProductId(@Param() { id }: ObjectIdParamDto) {
//     return await this.inventoryService.findByProductId(id);
//   }

//   // @Patch(':id')
//   // @UseGuards(JwtAuthGuard, RoleGuard)
//   // @Roles(RBAC.ADMIN)
//   // @HttpCode(HttpStatus.CREATED)
//   // async update(@Param() { id }: { id: string }, @Body() body: any) {
//   //   return await this.InventoryService.update(id, body);
//   // }

//   // @Delete(':id')
//   // @UseGuards(JwtAuthGuard, RoleGuard)
//   // @Roles(RBAC.ADMIN)
//   // @HttpCode(HttpStatus.CREATED)
//   // async remove(
//   //   @Param() { id }: ObjectIdParamDto,
//   // ): Promise<{ deletedCount: number }> {
//   //   return await this.InventoryService.remove(id);
//   // }
// }
