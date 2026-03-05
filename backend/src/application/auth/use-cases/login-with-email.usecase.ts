import { IUserRepository } from '@/domain/user/user.repository';
import { IPasswordHasher } from '@/application/auth/ports/password-hasher.port';
import { ITokenService } from '@/application/auth/ports/token-service.port';
import { IRefreshTokenRepository } from '../ports/refresh-token.repository.port';
import { IRefreshTokenHasher } from '../ports/refresh-token-hasher.port';
import { UnauthorizedException, ForbiddenException } from '@nestjs/common';

interface LoginMetadata {
  userAgent?: string;
  ipAddress?: string;
}

export class LoginWithEmailUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly passwordHasher: IPasswordHasher,
    private readonly tokenService: ITokenService,
    private readonly refreshTokenRepository: IRefreshTokenRepository,
    private readonly refreshTokenHasher: IRefreshTokenHasher,
  ) {}

  async execute(email: string, password: string, metadata?: LoginMetadata) {
    const user = await this.userRepository.findByEmail(email);

    if (!user || !user.passwordHash) {
      throw new UnauthorizedException('Invalid credentials!');
    }

    if (!user.isActive) {
      throw new ForbiddenException('User account is inactive. Please contact support!');
    }

    const passwordValid = await this.passwordHasher.compare(password, user.passwordHash);

    if (!passwordValid) {
      throw new UnauthorizedException('Invalid credentials!');
    }

    const { accessToken, refreshToken } = this.tokenService.issue(user);

    const tokenHash = this.refreshTokenHasher.hash(refreshToken);

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await this.refreshTokenRepository.create({
      userId: user.id,
      tokenHash,
      expiresAt,
      userAgent: metadata?.userAgent,
      ipAddress: metadata?.ipAddress,
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName ?? 'Người dùng ẩn danh',
        avatarUrl: user.avatarUrl ?? '',
        role: user.role,
      },
      tokens: {
        accessToken,
        refreshToken,
      },
    };
  }
}
