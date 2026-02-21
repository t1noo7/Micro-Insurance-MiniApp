import { IUserRepository } from '@/domain/user/user.repository';
import { IOAuthTokenVerifier } from '@/application/auth//ports/oath-token-verifier.port';
import { ITokenService } from '@/application/auth/ports/token-service.port';
import { User } from '@/domain/user/user.entity';
import { AuthProvider, UserRole } from '@/domain/user/user.types';
import { AuthError } from '@/application/common/errors/auth.errors';

export class LoginWithOAuthUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly oauthVerifier: IOAuthTokenVerifier,
    private readonly tokenService: ITokenService,
  ) {}

  async execute(supabaseAccessToken) {
    const payload = await this.oauthVerifier.verify(supabaseAccessToken);

    let user = await this.userRepository.findByEmail(payload.email);
    if (!user) {
      user = new User(
        crypto.randomUUID(),
        payload.email,
        null,
        payload.fullName ?? null,
        payload.avatarUrl ?? null,
        payload.provider as AuthProvider,
        payload.providerId,
        UserRole.USER,
        true,
        new Date(),
        new Date(),
      );
      await this.userRepository.create(user);
    }

    if (!user.isActive) {
      throw AuthError.userInactive();
    }

    return {
      user: { id: user.id, email: user.email, role: user.role },
      token: this.tokenService.issue(user),
    };
  }
}
