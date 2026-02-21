import { User } from '@/domain/user/user.entity';

export interface ITokenService {
  issue(user: User): {
    accessToken: string;
    refreshToken: string;
  };
}
