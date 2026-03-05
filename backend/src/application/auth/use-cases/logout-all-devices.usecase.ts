import { IRefreshTokenRepository } from '../ports/refresh-token.repository.port';

export class LogoutAllDevicesUseCase {
  constructor(private readonly refreshTokenRepository: IRefreshTokenRepository) {}

  async execute(userId: string) {
    await this.refreshTokenRepository.revokeAllByUserId(userId);
  }
}
