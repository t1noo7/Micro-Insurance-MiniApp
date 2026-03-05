import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtTokenService } from '@/infrastructure/security/jwt-token.service';
import { Request } from 'express';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly tokenService: JwtTokenService) {}

  canActivate(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest<Request>();
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      throw new UnauthorizedException('Authorization header missing');
    }

    const token = authHeader.replace('Bearer ', '');
    const payload = this.tokenService.verify(token);

    if (payload.type !== 'access') {
      throw new UnauthorizedException('Invalid token type');
    }

    req.user = payload;
    return true;
  }
}
