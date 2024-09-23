import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/category.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ObjectIdParamDto } from 'src/app/dtos/object-id.dto';

@Controller('category')
@UseGuards(JwtAuthGuard)
export class CategoryController {
  constructor(private categoryService: CategoryService) {}

  @Get()
  async getCategoryList() {
    return this.categoryService.findAll();
  }

  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  async findById(@Param() { id }: ObjectIdParamDto) {
    return await this.categoryService.findById(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/')
  async createCategory(@Body() createCategoryDTO: CreateCategoryDto) {
    return await this.categoryService.create(createCategoryDTO);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.CREATED)
  async update(@Param() { id }: { id: string }, @Body() body: any) {
    return await this.categoryService.update(id, body);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.CREATED)
  async remove(
    @Param() { id }: ObjectIdParamDto,
  ): Promise<{ deletedCount: number }> {
    return await this.categoryService.remove(id);
  }
}
