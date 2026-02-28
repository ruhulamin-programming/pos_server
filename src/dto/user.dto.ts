import { IsDate, IsNotEmpty, IsString } from 'class-validator';
import { UserRole } from '../../generated/prisma';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsNotEmpty()
  fullName: string;

  @IsString()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  phoneNumber: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsNotEmpty()
  address: string;
}

export class CreateTempUserDto {
  @IsString()
  @IsNotEmpty()
  fullName: string;

  @IsString()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  phoneNumber: string;

  @IsString()
  @IsNotEmpty()
  address: string;

  @IsString()
  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsNotEmpty()
  otp: string;

  @IsDate()
  @IsNotEmpty()
  expireAt: Date;
}

export class UserResponseDto {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string | null;
  address: string;
}

export class LoginResponse {
  id: string;
  email: string;
  accessToken: string;
  role: UserRole;
}
