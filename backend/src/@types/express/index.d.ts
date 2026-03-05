import { TokenPayload } from '@/application/auth/ports/token-service.port';

declare global {
  namespace Express {
    interface Request {
      user?: TokenPayload;
    }
  }
}
