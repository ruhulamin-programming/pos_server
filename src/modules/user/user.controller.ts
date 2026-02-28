import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import type { Request } from 'express';
import { User } from './user.model';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@Controller('api/v1/user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  //send otp for account verification
  @Post('/create')
  async createUser(@Body() data: User) {
    const result = await this.userService.createUser(data);
    return {
      success: true,
      message: 'User created successfully',
      data: result,
    };
  }

  // get all users
  @Get('/all')
  @UseGuards(JwtAuthGuard)
  async getAllUser(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
    @Query('search') search?: string,
  ) {
    const users = await this.userService.getAllUser(
      parseInt(page),
      parseInt(limit),
      search,
    );
    return {
      success: true,
      message: 'Users fetched successfully',
      data: users,
    };
  }

  //get single user
  @Get('/single-user/:userId')
  @UseGuards(JwtAuthGuard)
  async getUser(@Param('userId') userId: string) {
    const user = await this.userService.getUser(userId);
    return {
      success: true,
      message: 'User fetched successfully',
      data: user,
    };
  }

  //get my profile
  @Get('/my-profile')
  @UseGuards(JwtAuthGuard)
  async myProfile(@Req() req: Request & { user: { id: string } }) {
    const user = await this.userService.myProfile(req.user.id);
    return {
      success: true,
      message: 'My profile fetched successfully',
      data: user,
    };
  }

  //update user by user id
  @Patch('/update/:userId')
  @UseGuards(JwtAuthGuard)
  async updateUser(@Param('userId') userId: string, @Body() data: User) {
    await this.userService.updateUser(userId, data);
    return {
      success: true,
      message: 'User updated successfully',
    };
  }

  //update logged in user profile
  @Patch('/my-profile')
  @UseGuards(JwtAuthGuard)
  async updateLoggedInUser(
    @Body() data: User,
    @Req() req: Request & { user: { id: string } },
  ) {
    const userId = req.user.id;
    await this.userService.updateUser(userId, data);
    return {
      success: true,
      message: 'Profile has been updated successfully',
    };
  }

  //delete user by user id
  @Delete('/delete/:userId')
  async deleteUser(@Param('userId') userId: string) {
    await this.userService.deleteUser(userId);
    return {
      success: true,
      message: 'User deleted successfully',
    };
  }

  //login user
  @Post('/login')
  @HttpCode(200)
  async loginUser(@Body() data: { email: string; password: string }) {
    const user = await this.userService.loginUser(data);
    return {
      success: true,
      message: 'User logged in successfully',
      data: user,
    };
  }

  //change password
  @Patch('/change-password')
  @UseGuards(JwtAuthGuard)
  @HttpCode(200)
  async changePassword(
    @Req() req: Request & { user: { id: string } },
    @Body() data: { oldPassword: string; newPassword: string },
  ) {
    const id = req.user.id;
    await this.userService.changePassword(
      id,
      data.oldPassword,
      data.newPassword,
    );
    return {
      success: true,
      message: 'Password changed successfully',
    };
  }
}
