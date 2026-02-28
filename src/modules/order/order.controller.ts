import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { OrderService } from './order.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { UserData } from '../../common/decorators/user.decorator';
import { OrderItem } from '../../../generated/prisma';

@Controller('api/v1/order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post('/place-order')
  @UseGuards(JwtAuthGuard)
  async createOrder(
    @Body('orderItems') orderItems: OrderItem[],
    @UserData('id') userId: string,
  ) {
    await this.orderService.createOrder(userId, orderItems);
    return { success: true, message: 'Order created successfully' };
  }

  @Get('/all-orders')
  @UseGuards(JwtAuthGuard)
  async getAllOrders(
    @Query('page') page: string,
    @Query('limit') limit: string,
    @Query('menu') menu: string,
  ) {
    const orders = await this.orderService.getAllOrders(
      parseInt(page),
      parseInt(limit),
      menu,
    );
    return {
      success: true,
      message: 'Orders retrieved successfully',
      data: orders,
    };
  }

  @Get('/latest-orders')
  @UseGuards(JwtAuthGuard)
  async latestOrders() {
    const orders = await this.orderService.latestOrders();
    return {
      success: true,
      message: 'Latest orders retrieved successfully',
      data: orders,
    };
  }

  @Get('/daily-sells')
  @UseGuards(JwtAuthGuard)
  async dailySellsSummery() {
    const result = await this.orderService.dailySellsSummery();
    return {
      success: true,
      message: 'Daily sells summery retrieved successfully',
      data: result,
    };
  }

  @Get('/sells-summary')
  @UseGuards(JwtAuthGuard)
  async sellsSummery() {
    const result = await this.orderService.sellsSummery();
    return {
      success: true,
      message: 'Sells summery retrieved successfully',
      data: result,
    };
  }
}
