import { Injectable } from '@nestjs/common';
import { ITokenService } from '@/application/auth/ports/token-service.port';
import { IRefreshTokenRepository } from '../ports/refresh-token.repository.port';
import { IRefreshTokenHasher } from '../ports/refresh-token-hasher.port';
import { IUserRepository } from '@/domain/user/user.repository';
import { UnauthorizedException } from '@nestjs/common';

@Injectable()
export class RefreshTokenUseCase {
  constructor(
    private readonly tokenService: ITokenService,
    private readonly refreshTokenRepository: IRefreshTokenRepository,
    private readonly refreshTokenHasher: IRefreshTokenHasher,
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(refreshToken: string) {
    const payload = this.tokenService.verify(refreshToken);

    if (payload.type !== 'refresh') {
      throw new UnauthorizedException('Invalid token type!');
    }

    const tokenHash = this.refreshTokenHasher.hash(refreshToken);
    const storedToken = await this.refreshTokenRepository.findByTokenHash(tokenHash);

    if (!storedToken) {
      throw new UnauthorizedException('Refresh token not found!');
    }

    if (storedToken.revokedAt) {
      throw new UnauthorizedException('Refresh token has been revoked!');
    }

    if (storedToken.expiresAt < new Date()) {
      throw new UnauthorizedException('Refresh token has expired!');
    }

    await this.refreshTokenRepository.revoke(storedToken.id);

    const user = await this.userRepository.findById(payload.sub);
    if (!user || !user.isActive) {
      throw new UnauthorizedException('User invalid!');
    }

    const { accessToken, refreshToken: newRefreshToken } = this.tokenService.issue(user);
    const newHash = this.refreshTokenHasher.hash(newRefreshToken);
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await this.refreshTokenRepository.create({
      userId: user.id,
      tokenHash: newHash,
      expiresAt,
    });

    return {
      accessToken,
      refreshToken: newRefreshToken,
    };
  }
}
