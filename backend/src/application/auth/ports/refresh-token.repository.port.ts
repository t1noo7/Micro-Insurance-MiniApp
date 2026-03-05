export interface IRefreshTokenRepository {
  create(data: {
    userId: string;
    tokenHash: string;
    expiresAt: Date;
    userAgent?: string;
    ipAddress?: string;
  }): Promise<void>;

  findByTokenHash(tokenHash: string): Promise<{
    id: string;
    userId: string;
    revokedAt: Date | null;
    expiresAt: Date;
  } | null>;

  revoke(id: string): Promise<void>;

  revokeAllByUserId(userId: string): Promise<void>;
}
