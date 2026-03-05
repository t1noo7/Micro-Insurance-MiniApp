import { UnauthorizedException } from '@nestjs/common';
import { IRefreshTokenRepository } from '../ports/refresh-token.repository.port';
import { IRefreshTokenHasher } from '../ports/refresh-token-hasher.port';

export class LogoutUseCase {
  constructor(
    private readonly refreshRepo: IRefreshTokenRepository,
    private readonly hashService: IRefreshTokenHasher,
  ) {}

  async execute(refreshToken: string) {
    const sha256Hash = this.hashService.hash(refreshToken);
    const stored = await this.refreshRepo.findByTokenHash(sha256Hash);

    if (!stored) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    await this.refreshRepo.revoke(stored.id);

    return { message: 'Logged out successfully' };
  }
}
