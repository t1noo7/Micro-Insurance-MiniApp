import { IUserRepository } from '@/domain/user/user.repository';
import { IPasswordHasher } from '@/application/auth/ports/password-hasher.port';
import { ITokenService } from '@/application/auth/ports/token-service.port';

export class LoginWithEmailUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly passwordHasher: IPasswordHasher,
    private readonly tokenService: ITokenService,
  ) {}

  async execute(email: string, password: string) {
    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      throw new Error('Invalid credentials!');
    }

    if (!user.isActive) {
      throw new Error('User account is inactive. Please contact support!');
    }

    const passwordValid = await this.passwordHasher.compare(password, user.passwordHash ?? '');

    if (!passwordValid) {
      throw new Error('Invalid credentials!');
    }

    const tokens = this.tokenService.issue(user);

    return {
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName ?? 'Người dùng ẩn danh',
        avatarUrl: user.avatarUrl ?? '',
        role: user.role,
      },
      tokens,
    };
  }
}
