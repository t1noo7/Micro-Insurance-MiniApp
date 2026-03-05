import * as bcrypt from 'bcrypt';
import { IPasswordHasher } from '@/application/auth/ports/password-hasher.port';

export class BcryptPasswordHasher implements IPasswordHasher {
  async hash(plain: string): Promise<string> {
    const hashed = await bcrypt.hash(plain, 10);
    return hashed;
  }

  async compare(plain: string, hash: string): Promise<boolean> {
    const isMatch = await bcrypt.compare(plain, hash);
    return isMatch;
  }
}
