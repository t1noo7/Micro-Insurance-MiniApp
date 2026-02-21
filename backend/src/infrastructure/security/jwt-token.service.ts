import { JwtService } from '@nestjs/jwt';
import { ITokenService } from '@application/auth/ports/token-service.port';
import { User } from '@domain/user/user.entity';

export class JwtTokenService implements ITokenService {
  constructor(private readonly jwtService: JwtService) {}

  issue(user: User) {
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    const accessToken = this.jwtService.sign(payload, {
      expiresIn: '15m',
    });

    const refreshToken = this.jwtService.sign({ sub: user.id }, { expiresIn: '7d' });

    return {
      accessToken,
      refreshToken,
    };
  }
}
