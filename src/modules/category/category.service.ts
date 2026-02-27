import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Category } from './category.model';
import { PrismaService } from '../../prisma.service';

@Injectable()
export class CategoryService {
  constructor(private readonly prisma: PrismaService) {}

  //create category
  async createCategory(categoryData: Category): Promise<void> {
    const existingCategory = await this.prisma.category.findUnique({
      where: { categoryName: categoryData.categoryName },
    });
    if (existingCategory) {
      throw new ConflictException('Category already exists');
    }
    await this.prisma.category.create({
      data: categoryData,
    });
    return;
  }

  //all categories
  async getAllCategories(): Promise<Category[]> {
    return this.prisma.category.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  //update category
  async udpateCategory(
    categoryId: string,
    categoryData: Category,
  ): Promise<void> {
    const existingCategory = await this.prisma.category.findUnique({
      where: { id: categoryId },
    });
    if (!existingCategory) {
      throw new NotFoundException('Category not found');
    }
    await this.prisma.category.update({
      where: { id: categoryId },
      data: categoryData,
    });

    return;
  }

  //delete category
  async deleteCategory(categoryId: string): Promise<void> {
    const existingCategory = await this.prisma.category.findUnique({
      where: { id: categoryId },
    });
    if (!existingCategory) {
      throw new ConflictException('Category not found');
    }
    await this.prisma.category.delete({
      where: { id: categoryId },
    });
    return;
  }
}
