import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PrismaClient } from '@prisma/client';
import { PrismaUserRepository } from '@/infrastructure/database/prisma/repositories/prisma-user.repository';
import { LoginWithEmailUseCase } from '@/application/auth/use-cases/login-with-email.usecase';
import { LoginWithOAuthUseCase } from '@/application/auth/use-cases/login-with-oauth.usecase';
import { BcryptPasswordHasher } from '@/infrastructure/security/bcrypt-password-hasher';
import { JwtTokenService } from '@/infrastructure/security/jwt-token.service';
import { SupabaseOAuthVerifier } from '@/infrastructure/security/supabase-oauth-token-verifier';
import { AUTH_TOKENS } from '@/application/auth/auth.tokens';

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
    PrismaClient,
    {
      provide: AUTH_TOKENS.USER_REPOSITORY,
      useClass: PrismaUserRepository,
    },

    {
      provide: 'LoginWithEmailUseCase',
      useFactory: (userRepo, hasher, tokenSvc) =>
        new LoginWithEmailUseCase(userRepo, hasher, tokenSvc),
      inject: [
        AUTH_TOKENS.USER_REPOSITORY,
        AUTH_TOKENS.PASSWORD_HASHER,
        AUTH_TOKENS.TOKEN_VERIFIER,
      ],
    },

    {
      provide: 'LoginWithOAuthUseCase',
      useFactory: (userRepo, oauthVerifier, tokenSvc) =>
        new LoginWithOAuthUseCase(userRepo, oauthVerifier, tokenSvc),
      inject: [AUTH_TOKENS.USER_REPOSITORY, AUTH_TOKENS.OAUTH_VERIFIER, AUTH_TOKENS.TOKEN_VERIFIER],
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
  ],
})
export class AuthModule {}
