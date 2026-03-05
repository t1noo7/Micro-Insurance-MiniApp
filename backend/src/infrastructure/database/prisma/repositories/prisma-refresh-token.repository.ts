import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/infrastructure/database/prisma/prisma.service';
import { IRefreshTokenRepository } from '@/application/auth/ports/refresh-token.repository.port';

@Injectable()
export class PrismaRefreshTokenRepository implements IRefreshTokenRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: {
    userId: string;
    tokenHash: string;
    expiresAt: Date;
    userAgent?: string;
    ipAddress?: string;
  }): Promise<void> {
    await this.prisma.refreshToken.create({
      data: {
        userId: data.userId,
        tokenHash: data.tokenHash,
        expiresAt: data.expiresAt,
        userAgent: data.userAgent,
        ip: data.ipAddress,
      },
    });
  }

  async findByTokenHash(tokenHash: string) {
    const token = await this.prisma.refreshToken.findFirst({
      where: { tokenHash },
    });

    if (!token) return null;
    return {
      id: token.id,
      userId: token.userId,
      revokedAt: token.revokedAt,
      expiresAt: token.expiresAt,
    };
  }

  async revoke(id: string): Promise<void> {
    await this.prisma.refreshToken.update({
      where: { id },
      data: { revokedAt: new Date() },
    });
  }

  async revokeAllByUserId(userId: string): Promise<void> {
    await this.prisma.refreshToken.updateMany({
      where: { userId, revokedAt: null },
      data: { revokedAt: new Date() },
    });
  }
}
