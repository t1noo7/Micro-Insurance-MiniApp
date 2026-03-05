export interface JwtAccessPayload {
  sub: string;
  email: string;
  role: string;
  tokenVersion: number;
  jti: string;
}
