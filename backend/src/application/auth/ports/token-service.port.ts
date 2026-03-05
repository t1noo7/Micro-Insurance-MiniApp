import { User } from '@/domain/user/user.entity';

export interface TokenPayload {
  sub: string;
  tokenVersion: number;
  type: 'access' | 'refresh';
  jti: string;
  email?: string;
  role?: string;
}

export interface ITokenService {
  issue(user: User): {
    accessToken: string;
    refreshToken: string;
  };
  verify(token: string): TokenPayload;
}
