import { User as PrismaUser, UserRole as PrismaUserRole } from '@prisma/client';
import { IUserRepository } from '@/domain/user/user.repository';
import { User } from '@/domain/user/user.entity';
import { UserRole } from '@/domain/user/user.types';
import { PrismaService } from '../prisma.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PrismaUserRepository implements IUserRepository {
  constructor(private readonly prisma: PrismaService) {}

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
        role: user.role as PrismaUserRole,
        isActive: user.isActive,
        tokenVersion: user.tokenVersion,
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
      record.role as UserRole,
      record.isActive,
      record.tokenVersion,
      record.createdAt,
      record.updatedAt,
    );
  }
}
