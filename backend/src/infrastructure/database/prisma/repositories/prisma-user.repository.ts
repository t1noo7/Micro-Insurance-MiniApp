import { PrismaClient, User as PrismaUser } from '@prisma/client';
import { IUserRepository } from '@/domain/user/user.repository';
import { User } from '@/domain/user/user.entity';
import { AuthProvider, UserRole } from '@/domain/user/user.types';

export class PrismaUserRepository implements IUserRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findById(id: string): Promise<User | null> {
    const record = await this.prisma.user.findUnique({ where: { id } });
    return record ? this.toDomain(record) : null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const record = await this.prisma.user.findUnique({ where: { email } });
    return record ? this.toDomain(record) : null;
  }

  async create(user: User): Promise<User> {
    const record = await this.prisma.user.create({
      data: {
        id: user.id,
        email: user.email,
        passwordHash: user.passwordHash,
        fullName: user.fullName,
        avatarUrl: user.avatarUrl,
        provider: user.provider,
        providerId: user.providerId,
        role: user.role,
        isActive: user.isActive,
      },
    });
    return this.toDomain(record);
  }

  private toDomain(record: PrismaUser): User {
    return new User(
      record.id,
      record.email,
      record.passwordHash,
      record.fullName,
      record.avatarUrl,
      record.provider as AuthProvider,
      record.providerId,
      record.role as UserRole,
      record.isActive,
      record.createdAt,
      record.updatedAt,
    );
  }
}
