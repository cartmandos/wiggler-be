module.exports = (env) => ({
  apiPath: `/${process.env.API_PATH}/${process.env.API_VERSION}`,

  cookieSecret: process.env.COOKIE_SECRET_KEY,

  corsOptions: {
    origin: process.env.CLIENT_URL_ORIGIN,
    credentials: true,
  },

  loggerOptions: env === 'development' ? 'dev' : 'common',

  errorsOptions: { logging: env === 'development' },

  cloudinaryConfig: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    apiKey: process.env.CLOUDINARY_API_KEY,
    apiSecret: process.env.CLOUDINARY_API_SECRET,
  },
});
