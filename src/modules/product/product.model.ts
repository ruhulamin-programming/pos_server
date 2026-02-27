import { Prisma } from '../../../generated/prisma';

export class Product implements Prisma.ProductCreateInput {
  id: string;
  category: Prisma.CategoryCreateNestedOneWithoutProductsInput;
  productName: string;
  description: string;
  productImage: string;
  quantity: number;
  price: number;
}
