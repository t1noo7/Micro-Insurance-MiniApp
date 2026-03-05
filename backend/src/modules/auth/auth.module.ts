import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PrismaUserRepository } from '@/infrastructure/database/prisma/repositories/prisma-user.repository';
import { LoginWithEmailUseCase } from '@/application/auth/use-cases/login-with-email.usecase';
import { LoginWithOAuthUseCase } from '@/application/auth/use-cases/login-with-oauth.usecase';
import { BcryptPasswordHasher } from '@/infrastructure/security/bcrypt-password-hasher';
import { JwtTokenService } from '@/infrastructure/security/jwt-token.service';
import { SupabaseOAuthVerifier } from '@/infrastructure/security/supabase-oauth-token-verifier';
import { AUTH_TOKENS } from '@/application/auth/auth.tokens';
import { PrismaRefreshTokenRepository } from '@/infrastructure/database/prisma/repositories/prisma-refresh-token.repository';
import { Sha256RefreshTokenHasher } from '@/infrastructure/security/sha256-refresh-token-hasher';
import { PrismaService } from '@/infrastructure/database/prisma/prisma.service';
import { RefreshTokenUseCase } from '@/application/auth/use-cases/refresh-token.usecase';
import { LogoutUseCase } from '@/application/auth/use-cases/logout.usecase';
import { LogoutAllUseCase } from '@/application/auth/use-cases/logout-all.usecase';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'super-secret',
      signOptions: { expiresIn: '15m' },
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    PrismaService,
    {
      provide: AUTH_TOKENS.USER_REPOSITORY,
      useClass: PrismaUserRepository,
    },

    {
      provide: LoginWithEmailUseCase,
      useFactory: (userRepo, hasher, tokenSvc, refreshRepo, hashService) =>
        new LoginWithEmailUseCase(userRepo, hasher, tokenSvc, refreshRepo, hashService),
      inject: [
        AUTH_TOKENS.USER_REPOSITORY,
        AUTH_TOKENS.PASSWORD_HASHER,
        AUTH_TOKENS.TOKEN_VERIFIER,
        AUTH_TOKENS.REFRESH_TOKEN_REPOSITORY,
        AUTH_TOKENS.HASH_SERVICE,
      ],
    },

    {
      provide: LoginWithOAuthUseCase,
      useFactory: (userRepo, oauthVerifier, tokenSvc) =>
        new LoginWithOAuthUseCase(userRepo, oauthVerifier, tokenSvc),
      inject: [AUTH_TOKENS.USER_REPOSITORY, AUTH_TOKENS.OAUTH_VERIFIER, AUTH_TOKENS.TOKEN_VERIFIER],
    },

    {
      provide: RefreshTokenUseCase,
      useFactory: (tokenSvc, refreshRepo, hashService, userRepo) =>
        new RefreshTokenUseCase(tokenSvc, refreshRepo, hashService, userRepo),
      inject: [
        AUTH_TOKENS.TOKEN_VERIFIER,
        AUTH_TOKENS.REFRESH_TOKEN_REPOSITORY,
        AUTH_TOKENS.HASH_SERVICE,
        AUTH_TOKENS.USER_REPOSITORY,
      ],
    },

    {
      provide: LogoutUseCase,
      useFactory: (refreshRepo, hashService) => new LogoutUseCase(refreshRepo, hashService),
      inject: [AUTH_TOKENS.REFRESH_TOKEN_REPOSITORY, AUTH_TOKENS.HASH_SERVICE],
    },

    {
      provide: LogoutAllUseCase,
      useFactory: (refreshRepo) => new LogoutAllUseCase(refreshRepo),
      inject: [AUTH_TOKENS.REFRESH_TOKEN_REPOSITORY],
    },

    {
      provide: AUTH_TOKENS.PASSWORD_HASHER,
      useClass: BcryptPasswordHasher,
    },

    {
      provide: AUTH_TOKENS.TOKEN_VERIFIER,
      useClass: JwtTokenService,
    },

    {
      provide: AUTH_TOKENS.OAUTH_VERIFIER,
      useClass: SupabaseOAuthVerifier,
    },

    {
      provide: AUTH_TOKENS.REFRESH_TOKEN_REPOSITORY,
      useClass: PrismaRefreshTokenRepository,
    },
    {
      provide: AUTH_TOKENS.HASH_SERVICE,
      useClass: Sha256RefreshTokenHasher,
    },
  ],
})
export class AuthModule {}
