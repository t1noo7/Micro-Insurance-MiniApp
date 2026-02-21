export class AuthError extends Error {
  constructor(code: string) {
    super(code);
    this.name = 'AuthError';
  }

  static invalidCredentials() {
    return new AuthError('AUTH_INVALID_CREDENTIALS');
  }

  static userInactive() {
    return new AuthError('AUTH_USER_INACTIVE');
  }
}
