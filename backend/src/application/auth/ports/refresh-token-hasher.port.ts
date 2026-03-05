export interface IRefreshTokenHasher {
  hash(token: string): string;
}
