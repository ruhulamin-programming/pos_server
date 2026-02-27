import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { Category } from './category.model';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { SendResponse } from '../../common/interfaces/response.interface';

@Controller('api/v1/categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  //create category
  @Post('/create')
  @UseGuards(JwtAuthGuard)
  async createCategory(@Body() data: Category): Promise<SendResponse<void>> {
    await this.categoryService.createCategory(data);
    return {
      success: true,
      message: 'Category created successfully',
    };
  }

  //all categories
  @Get('/all')
  async getAllCategories() {
    return this.categoryService.getAllCategories();
  }

  //update category by id
  @Patch('/update/:categoryId')
  @UseGuards(JwtAuthGuard)
  async updateCategory(
    @Param('categoryId') categoryId: string,
    @Body() categoryData: Category,
  ): Promise<SendResponse<void>> {
    await this.categoryService.udpateCategory(categoryId, categoryData);
    return {
      success: true,
      message: 'Category updated successfully',
    };
  }

  //delete category by id
  @Delete('/delete/:categoryId')
  @UseGuards(JwtAuthGuard)
  async deleteCategory(
    @Param('categoryId') categoryId: string,
  ): Promise<SendResponse<void>> {
    await this.categoryService.deleteCategory(categoryId);
    return {
      success: true,
      message: 'Category deleted successfully',
    };
  }
}
