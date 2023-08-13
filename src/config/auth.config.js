const jwtExpiresInMin = process.env.JWT_EXPIRES_IN_MIN || 15;
const jwtExpiry =
  jwtExpiresInMin > 60
    ? `${Math.floor(jwtExpiresInMin / 60)}h`
    : jwtExpiresInMin * 60 * 1000;

module.exports = (env,host) => ({
  jwtConfig: {
    secret: process.env.JWT_SECRET_KEY,
    expiresIn: jwtExpiry,
  },

  tokenCookieOptions: {
    httpOnly: true,
    secure: env === 'production' ? true : false,
    sameSite: env === 'production' ? 'none' : 'lax',
    maxAge: 1000 * 60 * 60 * 24,
    domain: host,
    signed: true,
  },
});
