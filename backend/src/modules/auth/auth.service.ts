import { ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginWithEmailUseCase } from '@/application/auth/use-cases/login-with-email.usecase';
import { LoginWithOAuthUseCase } from '@/application/auth/use-cases/login-with-oauth.usecase';

@Injectable()
export class AuthService {
  constructor(
    private readonly loginWithEmailUseCase: LoginWithEmailUseCase,
    private readonly loginWithOAuthUseCase: LoginWithOAuthUseCase,
  ) {}
  async loginWithEmail(email: string, password: string) {
    try {
      return this.loginWithEmailUseCase.execute(email, password);
    } catch (e) {
      if (e.message === 'AUTH_INVALID_CREDENTIALS') {
        throw new UnauthorizedException();
      }
      if (e.message === 'AUTH_USER_INACTIVE') {
        throw new ForbiddenException();
      }
      throw e;
    }
  }

  async loginWithOAuth(token: string) {
    return this.loginWithOAuthUseCase.execute(token);
  }
}
