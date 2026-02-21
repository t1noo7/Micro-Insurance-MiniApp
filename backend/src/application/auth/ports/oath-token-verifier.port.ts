export interface OAuthUserPayload {
  provider: 'google' | 'facebook' | 'github';
  providerId: string;
  email: string;
  fullName?: string;
  avatarUrl?: string;
}

export interface IOAuthTokenVerifier {
  verify(token: string): Promise<OAuthUserPayload>;
}
