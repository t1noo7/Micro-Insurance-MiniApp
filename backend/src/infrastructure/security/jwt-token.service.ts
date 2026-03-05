import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ITokenService, TokenPayload } from '@/application/auth/ports/token-service.port';
import { User } from '@/domain/user/user.entity';
import { randomUUID } from 'crypto';

@Injectable()
export class JwtTokenService implements ITokenService {
  constructor(private readonly jwtService: JwtService) {}

  issue(user: User) {
    const accessPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      tokenVersion: user.tokenVersion ?? 0,
      type: 'access' as const,
      jti: randomUUID(),
    };

    const refreshPayload = {
      sub: user.id,
      tokenVersion: user.tokenVersion ?? 0,
      type: 'refresh' as const,
      jti: randomUUID(),
    };

    const accessToken = this.jwtService.sign(accessPayload, {
      expiresIn: '15m',
    });

    const refreshToken = this.jwtService.sign(refreshPayload, { expiresIn: '7d' });

    return {
      accessToken,
      refreshToken,
    };
  }

  verify(token: string): TokenPayload {
    const payload = this.jwtService.verify<TokenPayload>(token);
    return payload;
  }
}
