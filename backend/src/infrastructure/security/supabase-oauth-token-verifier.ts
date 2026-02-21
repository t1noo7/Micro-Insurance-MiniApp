import { jwtVerify, createRemoteJWKSet } from 'jose';
import {
  IOAuthTokenVerifier,
  OAuthUserPayload,
} from '@/application/auth/ports/oath-token-verifier.port';

const SUPABASE_PROJECT_URL = process.env.SUPABASE_PROJECT_URL;
const SUPABASE_JWKS_URL = `${SUPABASE_PROJECT_URL}/auth/v1/keys`;

const jwks = createRemoteJWKSet(new URL(SUPABASE_JWKS_URL));

type SupabaseProvider = 'google' | 'facebook' | 'github';

type SupabaseJwtPayload = {
  sub: string;
  email: string;

  app_metadata?: {
    provider?: SupabaseProvider;
  };

  user_metadata?: {
    full_name?: string;
    avatar_url?: string;
  };
};

export class SupabaseOAuthVerifier implements IOAuthTokenVerifier {
  async verify(token: string): Promise<OAuthUserPayload> {
    const { payload } = await jwtVerify(token, jwks);
    const supabasePayload = payload as SupabaseJwtPayload;
    const provider = supabasePayload.app_metadata?.provider;

    if (!provider) {
      throw new Error('OAuth provider missing from Supabase token');
    }

    return {
      provider,
      providerId: supabasePayload.sub!,
      email: supabasePayload.email!,
      fullName: supabasePayload.user_metadata?.full_name,
      avatarUrl: supabasePayload.user_metadata?.avatar_url,
    };
  }
}
