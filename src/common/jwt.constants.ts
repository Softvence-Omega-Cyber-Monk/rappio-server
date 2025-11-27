export const jwtConstants = {
  secret: process.env.JWT_SECRET || 'replace_with_a_strong_secret',
  expiresIn: process.env.JWT_EXPIRES_IN || '15m',
  refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
};
