import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import * as jwt from 'jsonwebtoken';

export interface RequestWithUser extends Request {
  user: {
    sub: string;
    email: string;
    role: string;
  };
}

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<RequestWithUser>();
    const token = this.extractTokenFromHeader(request);
    if (!token) throw new UnauthorizedException('User is not authorized.');

    try {
      if (!process.env.SECRET_KEY)
        throw new BadRequestException('Secret Key is missing.');
      const decodedToken = jwt.verify(token, process.env.SECRET_KEY) as {
        sub: string;
        email: string;
        role: string;
      };
      if (!decodedToken.sub)
        throw new UnauthorizedException(
          'User is not authenticaded, id is missing from token body.',
        );
      request['user'] = decodedToken;
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        throw new UnauthorizedException('Token expired.');
      }
      if (error instanceof jwt.JsonWebTokenError) {
        throw new UnauthorizedException('Invalid token.');
      }
      throw new InternalServerErrorException('Internal server error');
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
