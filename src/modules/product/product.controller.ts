import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { Product } from './product.model';

@Controller('api/v1/product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post('/create')
  @UseGuards(JwtAuthGuard)
  async createProduct(@Body() data: Product) {
    await this.productService.createProduct(data);
    return { success: true, message: 'Product created successfully' };
  }

  @Get('/all-products')
  @UseGuards(JwtAuthGuard)
  async getAllProducts(
    @Query('page') page: string,
    @Query('limit') limit: string,
  ) {
    const response = await this.productService.getAllProducts(
      parseInt(page),
      parseInt(limit),
    );
    return {
      success: true,
      message: 'Products retrieved successfully',
      data: response,
    };
  }

  @Get('/category/:categoryId')
  @UseGuards(JwtAuthGuard)
  async getProductsByCategory(
    @Param('categoryId') categoryId: string,
    @Query('page') page: string,
    @Query('limit') limit: string,
  ) {
    const response = await this.productService.getProductsByCategory(
      parseInt(page),
      parseInt(limit),
      categoryId,
    );
    return {
      success: true,
      message: 'Products retrieved successfully',
      data: response,
    };
  }

  @Get('/details/:productId')
  @UseGuards(JwtAuthGuard)
  async getProductDetails(@Param('productId') productId: string) {
    const product = await this.productService.getProductDetails(productId);
    return {
      success: true,
      message: 'Product details retrieved successfully',
      data: product,
    };
  }

  @Patch('/update/:productId')
  @UseGuards(JwtAuthGuard)
  async editProduct(
    @Param('productId') productId: string,
    @Body() data: Product,
  ) {
    await this.productService.editProduct(productId, data);
    return { success: true, message: 'Product updated successfully' };
  }

  @Delete('/delete/:productId')
  @UseGuards(JwtAuthGuard)
  async deleteProduct(@Param('productId') productId: string) {
    await this.productService.deleteProduct(productId);
    return { success: true, message: 'Product deleted successfully' };
  }
}
