import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { Product } from './product.model';

@Injectable()
export class ProductService {
  constructor(private readonly prisma: PrismaService) {}

  //create product
  async createProduct(data: Product) {
    await this.prisma.product.create({ data });
    return;
  }

  //get all products
  async getAllProducts(page: number, limit: number) {
    const skip = (page - 1) * limit;
    const products = await this.prisma.product.findMany({
      include: {
        category: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: limit,
      skip,
    });

    const totalCount = await this.prisma.product.count();
    const totalPages = Math.ceil(totalCount / limit);

    return {
      meta: {
        page,
        limit,
        totalCount,
        totalPages,
      },
      data: products,
    };
  }

  //get all products by category
  async getProductsByCategory(page: number, limit: number, categoryId: string) {
    const skip = (page - 1) * limit;
    const products = await this.prisma.product.findMany({
      where: {
        categoryId,
      },
      include: {
        category: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: limit,
      skip,
    });

    const totalCount = await this.prisma.product.count({
      where: {
        categoryId,
      },
    });
    const totalPages = Math.ceil(totalCount / limit);

    return {
      meta: {
        page,
        limit,
        totalCount,
        totalPages,
      },
      data: products,
    };
  }

  //get product details
  async getProductDetails(productId: string) {
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
      include: {
        category: true,
      },
    });
    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return product;
  }

  //edit product
  async editProduct(productId: string, data: Product) {
    const productInfo = await this.prisma.product.findUnique({
      where: { id: productId },
    });
    if (!productInfo) throw new NotFoundException('Product not found');

    await this.prisma.product.update({
      where: { id: productId },
      data: data,
    });
    return;
  }

  //delete product
  async deleteProduct(productId: string) {
    const productInfo = await this.prisma.product.findUnique({
      where: { id: productId },
    });
    if (!productInfo) throw new NotFoundException('Product not found');

    await this.prisma.product.delete({
      where: { id: productId },
    });
    return;
  }
}
