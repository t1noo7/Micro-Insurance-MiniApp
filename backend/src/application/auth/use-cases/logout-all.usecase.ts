import { IRefreshTokenRepository } from '../ports/refresh-token.repository.port';

export class LogoutAllUseCase {
  constructor(private readonly refreshRepo: IRefreshTokenRepository) {}

  async execute(userId: string) {
    await this.refreshRepo.revokeAllByUserId(userId);
    return { message: 'Logged out from all devices successfully' };
  }
}
