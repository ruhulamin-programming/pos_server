import { Prisma } from '../../../generated/prisma';

export class Category implements Prisma.CategoryCreateInput {
  id: string;
  categoryName: string;
  icon: string;
}
