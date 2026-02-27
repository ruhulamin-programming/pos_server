import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { JwtPayload } from 'jsonwebtoken';
import { jwtHelpers } from 'src/shared/jwt/jwtHelpers';
import jwtConfig from 'src/config/jwt.config';

interface AuthRequest extends Request {
  user?: JwtPayload & { id: string; email: string };
}

@Injectable()
export class JwtAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<AuthRequest>();
    const token = this.extractToken(request);

    if (!token) {
      throw new UnauthorizedException('Token not found');
    }

    try {
      const decoded = jwtHelpers.verifyToken(
        token,
        jwtConfig.jwt_secret as string,
      );

      if (!this.isValidPayload(decoded)) {
        throw new UnauthorizedException('Invalid token payload');
      }

      request.user = decoded as JwtPayload & { id: string; email: string };
      return true;
    } catch (error) {
      throw new UnauthorizedException(error);
    }
  }

  private extractToken(request: AuthRequest): string | undefined {
    const authHeader = request.headers.authorization;
    if (!authHeader) return undefined;

    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      return undefined;
    }

    return parts[1];
  }

  private isValidPayload(payload: {
    [key: string]: any;
  }): payload is JwtPayload & { id: string; email: string } {
    return (
      payload &&
      typeof payload.id === 'string' &&
      typeof payload.email === 'string'
    );
  }
}
