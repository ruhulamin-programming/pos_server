import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { TempUser, User } from './user.model';
import bcrypt from 'bcryptjs';
import { jwtHelpers } from '../../shared/jwt/jwtHelpers';
import jwtConfig from '../../config/jwt.config';
import { PrismaService } from '../../prisma.service';
import { Prisma } from '../../../generated/prisma';
import generateOTP from '../../shared/generateOtp';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  //send otp for account verification
  async createUser(data: TempUser) {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: data.email },
    });
    if (existingUser) {
      throw new ConflictException({
        success: false,
        message: 'User with this email already exists',
      });
    }

    const hashedPassword = bcrypt.hashSync(data.password, 10);
    const otp = generateOTP();
    const expireAt = new Date(Date.now() + 10 * 60 * 1000);

    await this.prisma.tempUser.upsert({
      where: { email: data.email },
      update: {
        fullName: data.fullName,
        phoneNumber: data.phoneNumber,
        password: hashedPassword,
        address: data.address,
        otp,
        expireAt,
      },
      create: {
        fullName: data.fullName,
        email: data.email,
        phoneNumber: data.phoneNumber,
        password: hashedPassword,
        address: data.address,
        otp,
        expireAt,
      },
    });

    return;
  }

  async verifyUser(email: string, otp: string) {
    const tempUser = await this.prisma.tempUser.findUnique({
      where: { email },
    });
    if (!tempUser) {
      throw new NotFoundException({
        success: false,
        message: 'Temp user not found',
      });
    }
    if (tempUser.otp !== otp) {
      throw new ConflictException({
        success: false,
        message: 'Invalid OTP',
      });
    }
    if (tempUser.expireAt < new Date()) {
      throw new ConflictException({
        success: false,
        message: 'OTP expired',
      });
    }

    const user = await this.prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          fullName: tempUser.fullName,
          email: tempUser.email,
          phoneNumber: tempUser.phoneNumber,
          password: tempUser.password,
          address: tempUser.address,
        },
      });

      await tx.tempUser.delete({
        where: { email },
      });
      return user;
    });

    const accessToken = jwtHelpers.generateToken(
      { id: user.id, email: user.email, role: user.role },
      jwtConfig.jwt_secret as string,
      jwtConfig.expires_in as string,
    );

    return {
      accessToken,
      id: user.id,
      email: user.email,
      role: user.role,
    };
  }

  //get all users
  async getAllUser(page: number, limit: number, search?: string) {
    const whereCondition: Prisma.UserWhereInput = {
      ...(search && {
        fullName: {
          contains: search,
          mode: 'insensitive',
        },
      }),
    };

    const skip = (page - 1) * limit;
    const users = await this.prisma.user.findMany({
      where: whereCondition,
      select: {
        id: true,
        fullName: true,
        email: true,
        phoneNumber: true,
        address: true,
      },
      skip,
      take: limit,
      orderBy: {
        createdAt: 'desc',
      },
    });

    const totalCount = await this.prisma.user.count();
    const totalPages = Math.ceil(totalCount / limit);

    return {
      meta: {
        page,
        limit,
        totalCount,
        totalPages,
      },
      data: users,
    };
  }

  //get single user
  async getUser(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        fullName: true,
        email: true,
        phoneNumber: true,
        address: true,
        role: true,
      },
    });
    if (!user)
      throw new NotFoundException({
        success: false,
        message: 'User not found',
      });

    return user;
  }

  //get my profile
  async myProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        fullName: true,
        email: true,
        phoneNumber: true,
        address: true,
      },
    });
    if (!user)
      throw new NotFoundException({
        success: false,
        message: 'User not found',
      });

    return user;
  }

  //update user by user id
  async updateUser(userId: string, data: User) {
    const userInfo = await this.prisma.user.findUnique({
      where: { id: userId },
    });
    if (!userInfo)
      throw new NotFoundException({
        success: false,
        message: 'User not found',
      });
    await this.prisma.user.update({
      where: { id: userId },
      data,
    });
    return;
  }

  //delete user by user id
  async deleteUser(userId: string) {
    const userInfo = await this.prisma.user.findUnique({
      where: { id: userId },
    });
    if (!userInfo)
      throw new NotFoundException({
        success: false,
        message: 'User not found',
      });
    await this.prisma.user.delete({
      where: { id: userId },
    });
    return;
  }

  //auth login
  async loginUser(data: { email: string; password: string }) {
    const user = await this.prisma.user.findUnique({
      where: {
        email: data.email,
      },
    });
    if (!user)
      throw new NotFoundException({
        success: false,
        message: 'Account not found',
      });

    const isPasswordValid = bcrypt.compareSync(data.password, user.password);
    if (!isPasswordValid) {
      throw new ConflictException({
        success: false,
        message: 'Invalid credentials',
      });
    }

    const accessToken = jwtHelpers.generateToken(
      { id: user.id, email: user.email, role: user.role },
      jwtConfig.jwt_secret as string,
      jwtConfig.expires_in as string,
    );

    return {
      accessToken,
      id: user.id,
      email: user.email,
      role: user.role,
    };
  }

  //change password
  async changePassword(
    userId: string,
    oldPassword: string,
    newPassword: string,
  ) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });
    if (!user)
      throw new NotFoundException({
        success: false,
        message: 'User not found',
      });

    const isOldPasswordValid = bcrypt.compareSync(oldPassword, user.password);
    if (!isOldPasswordValid) {
      throw new ConflictException({
        success: false,
        message: 'Old password is incorrect',
      });
    }

    const hashedNewPassword = bcrypt.hashSync(newPassword, 10);
    await this.prisma.user.update({
      where: { id: userId },
      data: { password: hashedNewPassword },
    });

    return;
  }
}
