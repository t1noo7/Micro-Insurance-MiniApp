import { createHash } from 'crypto';
import { IRefreshTokenHasher } from '@/application/auth/ports/refresh-token-hasher.port';

export class Sha256RefreshTokenHasher implements IRefreshTokenHasher {
  hash(token: string): string {
    return createHash('sha256').update(token).digest('hex');
  }
}
