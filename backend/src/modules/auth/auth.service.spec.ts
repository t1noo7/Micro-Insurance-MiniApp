import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { LoginWithEmailUseCase } from '@/application/auth/use-cases/login-with-email.usecase';
import { LoginWithOAuthUseCase } from '@/application/auth/use-cases/login-with-oauth.usecase';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: LoginWithEmailUseCase, useValue: {} },
        { provide: LoginWithOAuthUseCase, useValue: {} },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
