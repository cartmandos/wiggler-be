const dbPool = {
  max: 5,
  min: 0,
  acquire: 30000,
  idle: 10000,
};

module.exports = {
  development: {
    database: process.env.DEV_DB_NAME,
    username: process.env.DEV_DB_USER,
    password: process.env.DEV_DB_PASSWORD,
    host: process.env.DEV_DB_HOST,
    port: process.env.DEV_DB_PORT,
    dialect: process.env.DB_DRIVER,
    dbPool,
  },
  test: {
    database: process.env.CI_DB_NAME,
    username: process.env.CI_DB_USERNAME,
    password: process.env.CI_DB_PASSWORD,
    host: process.env.CI_DB_HOSTNAME,
    port: process.env.CI_DB_PORT,
    dialect: process.env.DB_DRIVER,
    dbPool,
  },
  production: {
    database: process.env.PROD_DB_NAME,
    username: process.env.PROD_DB_USERNAME,
    password: process.env.PROD_DB_PASSWORD,
    host: process.env.PROD_DB_HOSTNAME,
    port: process.env.PROD_DB_PORT,
    dialect: process.env.DB_DRIVER,
    dbPool,
  },
};
