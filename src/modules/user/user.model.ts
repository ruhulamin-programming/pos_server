import { Prisma } from '../../../generated/prisma';

export class TempUser implements Prisma.TempUserCreateInput {
  id: string;
  email: string;
  phoneNumber: string;
  password: string;
  fullName: string;
  address: string;
  otp: string;
  expireAt: string | Date;
}

export class User implements Prisma.UserCreateInput {
  id: string;
  email: string;
  phoneNumber: string;
  address: string;
  password: string;
  fullName: string;
}
