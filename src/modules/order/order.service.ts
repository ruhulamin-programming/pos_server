import { Injectable } from '@nestjs/common';
import { OrderItem, Prisma } from '../../../generated/prisma';
import { PrismaService } from '../../prisma.service';

@Injectable()
export class OrderService {
  constructor(private readonly prisma: PrismaService) {}

  //create orders
  async createOrder(userId: string, orderItems: OrderItem[]) {
    await this.prisma.order.create({
      data: {
        status: 'PENDING',
        userId,
        orderItems: {
          create: orderItems,
        },
      },
    });

    return;
  }

  //get all orders
  async getAllOrders(page: number, limit: number, menu?: string) {
    const skip = (page - 1) * limit;
    const whereCondition: Prisma.OrderItemWhereInput = {
      ...(menu && {
        product: {
          productName: {
            contains: menu,
            mode: 'insensitive',
          },
        },
      }),
    };

    const orders = await this.prisma.orderItem.findMany({
      where: whereCondition,
      select: {
        id: true,
        quantity: true,
        subTotal: true,
        order: {
          select: {
            id: true,
            status: true,
          },
        },
        product: {
          select: {
            id: true,
            productName: true,
            category: {
              select: {
                id: true,
                categoryName: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    });
    const totalCount = await this.prisma.order.count();
    const totalPages = Math.ceil(totalCount / limit);
    return {
      meta: {
        page,
        limit,
        totalCount,
        totalPages,
      },
      data: orders,
    };
  }

  //daily sells summery
  async dailySellsSummery() {
    const today = new Date();
    const startOfDay = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
    );
    const endOfDay = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() + 1,
    );

    const dailySells = await this.prisma.orderItem.aggregate({
      where: {
        order: {
          createdAt: {
            gte: startOfDay,
            lt: endOfDay,
          },
        },
      },
      _sum: {
        subTotal: true,
      },
    });

    const sellsCount = await this.prisma.orderItem.count({
      where: {
        order: {
          createdAt: {
            gte: startOfDay,
            lt: endOfDay,
          },
        },
      },
    });

    return {
      totalSales: dailySells._sum.subTotal || 0,
      sellsCount,
    };
  }
}
