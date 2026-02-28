import { Prisma } from '../../../generated/prisma';

export class User implements Prisma.UserCreateInput {
  id: string;
  email: string;
  phoneNumber: string;
  address: string;
  password: string;
  fullName: string;
}
