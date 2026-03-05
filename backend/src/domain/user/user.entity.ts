import { UserRole } from './user.types';

export class User {
  constructor(
    public readonly id: string,
    public email: string,
    public passwordHash: string | null,
    public fullName: string | null,
    public avatarUrl: string | null,
    public role: UserRole,
    public isActive: boolean,
    public tokenVersion: number,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}

  isAdmin(): boolean {
    return this.role === UserRole.ADMIN;
  }

  disable(): void {
    this.isActive = false;
  }
}
