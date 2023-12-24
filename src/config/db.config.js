const dbPool = {
  max: 5,
  min: 0,
  acquire: 30000,
  idle: 10000,
};

const dialect = process.env.DB_DRIVER;

module.exports = {
  development: {
    database: process.env.DEV_DB_NAME,
    username: process.env.DEV_DB_USER,
    password: process.env.DEV_DB_PASSWORD,
    host: process.env.DEV_DB_HOST,
    port: process.env.DEV_DB_PORT,
    schema: process.env.DEV_DB_SCHEMA,
    dialect,
    dbPool,
  },
  test: {
    database: process.env.CI_DB_NAME,
    username: process.env.CI_DB_USER,
    password: process.env.CI_DB_PASSWORD,
    host: process.env.CI_DB_HOST,
    port: process.env.CI_DB_PORT,
    schema: process.env.CI_DB_SCHEMA,
    dialect,
    dbPool,
  },
  production: {
    database: process.env.PROD_DB_NAME,
    username: process.env.PROD_DB_USER,
    password: process.env.PROD_DB_PASSWORD,
    host: process.env.PROD_DB_HOST,
    port: process.env.PROD_DB_PORT,
    schema: process.env.PROD_DB_SCHEMA,
    dialect,
    dbPool,
  },
};
