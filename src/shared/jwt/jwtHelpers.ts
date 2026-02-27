import { ConflictException } from '@nestjs/common';
import jwt, { JwtPayload, Secret, SignOptions } from 'jsonwebtoken';

const generateToken = (payload: object, secret: Secret, expiresIn: string) => {
  if (!secret) {
    console.error(
      'generateToken failed: secret is',
      secret,
      'expiresIn is',
      expiresIn,
    );
    throw new ConflictException('JWT secret is not defined');
  }
  const options: SignOptions = {
    algorithm: 'HS256',
    expiresIn: expiresIn as SignOptions['expiresIn'],
  };

  const token = jwt.sign(payload, secret, options);
  return token;
};

const verifyToken = (token: string, secret: Secret) => {
  return jwt.verify(token, secret) as JwtPayload;
};

export const jwtHelpers = {
  generateToken,
  verifyToken,
};
