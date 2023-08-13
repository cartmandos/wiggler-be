const { host, port, env } = require('../../config');
const dbConfig = require('./db.config')[env];
const appConfig = require('./app.config')(env);
const authConfig = require('./auth.config')(env, host);

module.exports = {
  host,
  port,
  env,
  appConfig,
  dbConfig,
  authConfig,
};
