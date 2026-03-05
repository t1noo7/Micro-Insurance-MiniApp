import { ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginWithEmailUseCase } from '@/application/auth/use-cases/login-with-email.usecase';
import { LoginWithOAuthUseCase } from '@/application/auth/use-cases/login-with-oauth.usecase';
import { RefreshTokenUseCase } from '@/application/auth/use-cases/refresh-token.usecase';
import { LogoutUseCase } from '@/application/auth/use-cases/logout.usecase';
import { LogoutAllUseCase } from '@/application/auth/use-cases/logout-all.usecase';

@Injectable()
export class AuthService {
  constructor(
    private readonly loginWithEmailUseCase: LoginWithEmailUseCase,
    private readonly loginWithOAuthUseCase: LoginWithOAuthUseCase,
    private readonly refreshTokenUseCase: RefreshTokenUseCase,
    private readonly logoutUseCase: LogoutUseCase,
    private readonly logoutAllUseCase: LogoutAllUseCase,
  ) {}
  async loginWithEmail(email: string, password: string) {
    try {
      return await this.loginWithEmailUseCase.execute(email, password);
    } catch (e) {
      const err = e as Error;
      if (err.message === 'AUTH_INVALID_CREDENTIALS') {
        throw new UnauthorizedException();
      }
      if (err.message === 'AUTH_USER_INACTIVE') {
        throw new ForbiddenException();
      }
      throw e;
    }
  }

  async loginWithOAuth(token: string) {
    return this.loginWithOAuthUseCase.execute(token);
  }

  async refreshToken(refreshToken: string) {
    try {
      return await this.refreshTokenUseCase.execute(refreshToken);
    } catch (e) {
      const err = e as Error;
      if (err.message.startsWith('AUTH_')) {
        throw new UnauthorizedException(err.message);
      }
      throw e;
    }
  }

  async logout(refreshToken: string) {
    try {
      return await this.logoutUseCase.execute(refreshToken);
    } catch (e) {
      const err = e as Error;
      if (err.message === 'Invalid refresh token') {
        throw new UnauthorizedException(err.message);
      }
      throw e;
    }
  }

  async logoutAll(userId: string) {
    return await this.logoutAllUseCase.execute(userId);
  }
}
